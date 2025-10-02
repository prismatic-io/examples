import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";
import type { Flow, Input, IntegrationSchema, Step } from "./integrationSchema";
import type {
  StepErrorHandlingConfiguration,
  WorkflowDefinition,
  WorkflowRetryConfiguration,
  YmlStep,
} from "./workflowSchema";

interface MigrationReport {
  flowName: string;
  status: "converted" | "skipped";
  reason?: string;
  removedConfigVars: number;
  removedTemplates: number;
  crossFlowActionsConverted: number;
  crossFlowActionDetails: Array<{
    originalName: string;
    originalComponentKey: string;
  }>;
  managementTriggerFound?: boolean;
  lossyTransformations: string[];
}

interface MigrationSummary {
  integrationName: string;
  totalFlows: number;
  convertedFlows: number;
  skippedFlows: number;
  flowReports: MigrationReport[];
}

function parseArguments(): { inputFile: string; outputDir: string } {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error(
      "Usage: npm run migrate <input-yaml-file> <output-directory>"
    );
    console.error("Example: npm run migrate integration.yml ./output");
    process.exit(1);
  }

  return {
    inputFile: args[0],
    outputDir: args[1],
  };
}

function loadIntegrationSchema(filePath: string): IntegrationSchema {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file does not exist: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(fileContent) as IntegrationSchema;

  if (!parsed || !parsed.flows) {
    throw new Error("Invalid integration schema: missing flows");
  }

  return parsed;
}

function hasManagementTrigger(flow: Flow): boolean {
  if (!flow.steps || flow.steps.length === 0) {
    return false;
  }

  const firstStep = flow.steps[0];
  return (
    firstStep.isTrigger === true &&
    firstStep.action.component.key === "management-triggers"
  );
}

function isCrossFlowAction(step: Step): boolean {
  return step.action.component.key === "cross-flow";
}

function convertInputType(input: Input, report: MigrationReport): Input {
  if ("type" in input) {
    if (input.type === "configVar") {
      report.removedConfigVars++;
      report.lossyTransformations.push(
        `ConfigVar input converted to empty value: ${input.value}`
      );
      return {
        ...input,
        type: "value" as const,
        value: "",
      };
    }

    if (input.type === "template" && input.value.includes("{{#")) {
      report.removedTemplates++;
      report.lossyTransformations.push(
        `Template input with config variable converted to empty value: ${input.value}`
      );
      return {
        ...input,
        type: "value" as const,
        value: "",
      };
    }
  }

  return input;
}

function convertCrossFlowActionToLogStep(step: Step): YmlStep {
  return {
    name: step.name,
    description: "",
    action: {
      component: {
        isPublic: true,
        key: "log",
        version: "LATEST",
      },
      key: "writeLog",
    },
    inputs: {
      level: {
        type: "value",
        value: "info",
      },
      message: {
        type: "value",
        value: "Converted from cross flow action",
      },
    },
  };
}

function convertStep(step: Step, report: MigrationReport): YmlStep {
  if (isCrossFlowAction(step)) {
    report.crossFlowActionsConverted++;
    report.crossFlowActionDetails.push({
      originalName: step.name,
      originalComponentKey: step.action.component.key,
    });
    report.lossyTransformations.push(
      `Cross-flow action "${step.name}" converted to log message`
    );
    return convertCrossFlowActionToLogStep(step);
  }

  const convertedInputs: Record<string, any> = {};

  if (step.inputs) {
    for (const [key, input] of Object.entries(step.inputs)) {
      convertedInputs[key] = convertInputType(input, report);
    }
  }

  let errorConfig: StepErrorHandlingConfiguration | undefined;
  if (step.errorConfig) {
    if (step.errorConfig.errorHandlerType === "retry") {
      errorConfig = {
        errorHandlerType: "retry",
        delaySeconds: step.errorConfig.delaySeconds || 0,
        ignoreFinalError: step.errorConfig.ignoreFinalError || false,
        maxAttempts: step.errorConfig.maxAttempts || 1,
      };
    } else if (step.errorConfig.errorHandlerType === "ignore") {
      errorConfig = { errorHandlerType: "ignore" };
    } else {
      errorConfig = { errorHandlerType: "fail" };
    }
  }

  const ymlStep: YmlStep = {
    name: step.name,
    description: step.description || "",
    action: {
      component: {
        isPublic: step.action.component.isPublic,
        key: step.action.component.key,
        version: step.action.component.version,
      },
      key: step.action.key,
    },
    inputs: convertedInputs,
  };

  if (step.isTrigger) {
    ymlStep.isTrigger = true;
  }

  if (errorConfig) {
    ymlStep.errorConfig = errorConfig;
  }

  if (step.schedule) {
    ymlStep.schedule = {
      type: step.schedule.type as "value" | "template",
      value: step.schedule.value,
      meta: {
        scheduleType: step.schedule.meta.scheduleType,
        timeZone: step.schedule.meta.timeZone,
      },
    };
  }

  if (step.steps && step.steps.length > 0) {
    ymlStep.steps = step.steps.map((s) => convertStep(s, report));
  }

  if (step.branches && step.branches.length > 0) {
    ymlStep.branches = step.branches.map((branch) => ({
      name: branch.name,
      steps: branch.steps.map((s) => convertStep(s, report)),
    }));
  }

  return ymlStep;
}

function convertFlowToWorkflow(flow: Flow): {
  workflow: WorkflowDefinition | null;
  report: MigrationReport;
} {
  const report: MigrationReport = {
    flowName: flow.name,
    status: "converted",
    removedConfigVars: 0,
    removedTemplates: 0,
    crossFlowActionsConverted: 0,
    crossFlowActionDetails: [],
    lossyTransformations: [],
  };

  if (hasManagementTrigger(flow)) {
    report.status = "skipped";
    report.reason = "Flow uses management trigger";
    report.managementTriggerFound = true;
    report.lossyTransformations.push("Flow skipped due to management trigger");

    return {
      workflow: null,
      report,
    };
  }

  let retryConfig: WorkflowRetryConfiguration = null;
  if (flow.retryConfig) {
    retryConfig = {
      maxAttempts: flow.retryConfig.maxAttempts,
      delayMinutes: flow.retryConfig.delayMinutes,
      usesExponentialBackoff: flow.retryConfig.usesExponentialBackoff,
    };
  }

  const convertedSteps = flow.steps.map((step) => convertStep(step, report));

  const workflow: WorkflowDefinition = {
    name: flow.name,
    description: flow.description || "",
    documentation: "",
    definitionVersion: 1,
    definitionType: "workflow",
    flow: {
      name: flow.name,
      steps: convertedSteps,
      isSynchronous: flow.isSynchronous,
      retryConfig,
    },
  };

  return { workflow, report };
}

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
}

function writeWorkflowFile(
  workflow: WorkflowDefinition,
  outputDir: string,
  integrationName: string
): void {
  const fileName = `${sanitizeFileName(workflow.name)}.yml`;
  const filePath = path.join(
    outputDir,
    sanitizeFileName(integrationName),
    fileName
  );

  const yamlContent = yaml.dump(workflow, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  });

  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, yamlContent, "utf8");
}

function writeReportFile(
  report: MigrationReport,
  outputDir: string,
  integrationName: string
): void {
  const fileName = `${sanitizeFileName(report.flowName)}-migration-report.json`;
  const filePath = path.join(
    outputDir,
    sanitizeFileName(integrationName),
    fileName
  );

  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
}

function writeSummaryFile(
  summary: MigrationSummary,
  outputDir: string,
  integrationName: string
): void {
  const filePath = path.join(
    outputDir,
    sanitizeFileName(integrationName),
    "migration-summary.json"
  );

  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(summary, null, 2), "utf8");
}

function main(): void {
  try {
    const { inputFile, outputDir } = parseArguments();

    console.log(`Loading integration schema from: ${inputFile}`);
    const integrationSchema = loadIntegrationSchema(inputFile);

    console.log(`Processing integration: ${integrationSchema.name}`);
    console.log(`Found ${integrationSchema.flows.length} flows`);

    const summary: MigrationSummary = {
      integrationName: integrationSchema.name,
      totalFlows: integrationSchema.flows.length,
      convertedFlows: 0,
      skippedFlows: 0,
      flowReports: [],
    };

    for (const flow of integrationSchema.flows) {
      console.log(`\nProcessing flow: ${flow.name}`);

      const { workflow, report } = convertFlowToWorkflow(flow);
      summary.flowReports.push(report);

      if (report.status === "converted" && workflow) {
        summary.convertedFlows++;
        writeWorkflowFile(workflow, outputDir, integrationSchema.name);
        console.log("  ✓ Converted to workflow YAML");

        if (report.crossFlowActionsConverted > 0) {
          console.log(
            `  ⚠ Converted ${report.crossFlowActionsConverted} cross-flow actions to log steps`
          );
        }

        if (report.removedConfigVars > 0 || report.removedTemplates > 0) {
          console.log(
            `  ⚠ Removed ${report.removedConfigVars} config vars and ${report.removedTemplates} templates`
          );
        }
      } else {
        summary.skippedFlows++;
        console.log(`  ✗ Skipped: ${report.reason}`);
      }

      writeReportFile(report, outputDir, integrationSchema.name);
    }

    writeSummaryFile(summary, outputDir, integrationSchema.name);

    console.log("\n=== Migration Complete ===");
    console.log(`Total flows: ${summary.totalFlows}`);
    console.log(`Converted: ${summary.convertedFlows}`);
    console.log(`Skipped: ${summary.skippedFlows}`);
    console.log(
      `Output directory: ${path.join(
        outputDir,
        sanitizeFileName(integrationSchema.name)
      )}`
    );

    if (summary.skippedFlows > 0) {
      console.log(
        "\nSome flows were skipped. Check the migration reports for details."
      );
    }
  } catch (error) {
    console.error(
      "Migration failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
