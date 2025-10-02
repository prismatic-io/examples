# Integration to Workflow Migration Tool

This tool migrates Prismatic IntegrationSchema YAML files to individual WorkflowDefinition YAML files, and helps if you are migrating from the embedded designer to the embedded workflow builder.

## Features

- **Flow-to-Workflow Conversion**: Each flow in the integration becomes a separate workflow YAML file
- **Configuration Removal**: Strips all config pages, required config vars, and converts configVar/template inputs to empty values
- **Management Trigger Detection**: Automatically detects and skips flows with management triggers (`component.key === "management-triggers"`)
- **Cross-Flow Action Conversion**: Converts cross-flow actions (`component.key === "cross-flow"`) to standardized log message steps
- **Comprehensive Reporting**: Generates detailed migration reports for each flow and an overall summary
- **Error Handling**: Robust error handling with clear error messages

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npm run migrate <input-yaml-file> <output-directory>
```

### Example

```bash
npm run migrate sample-integration.yml ./output
```

This will:

1. Parse the integration schema from `sample-integration.yml`
2. Create an output directory structure: `./output/integration-name/`
3. Generate workflow YAML files for each convertible flow
4. Create migration reports for each flow
5. Generate an overall migration summary

## Output Structure

```
output/
└── sample-e-commerce-integration/
    ├── migration-summary.json                 # Overall migration summary
    ├── customer-sync-migration-report.json    # Migration report for customer-sync flow
    ├── customer-sync.yml                      # Converted workflow YAML for customer-sync flow
    ├── management-flow-migration-report.json  # Migration report for management-flow
    ├── order-processing-migration-report.json # Migration report for order-processing flow
    └── order-processing.yml                   # Converted workflow YAML for order-processing flow
```

## Migration Transformations

### 1. Configuration Removal

- **Config Pages**: Completely removed from output
- **Required Config Vars**: Stripped from workflow definitions
- **ConfigVar Inputs**: `type: "configVar"` -> `type: "value", value: ""`
- **Template Inputs**: `type: "template"` -> `type: "value", value: ""`

### 2. Management Trigger Detection

Flows with triggers where `component.key === "management-triggers"` are:

- Skipped from conversion
- Documented in the migration report with reason "Flow uses management trigger"

### 3. Cross-Flow Action Conversion

Steps with `component.key === "cross-flow"` are converted to:

```yaml
- action:
    component:
      isPublic: true
      key: log
      version: LATEST
    key: writeLog
  description: ""
  inputs:
    level:
      type: value
      value: info
    message:
      type: value
      value: Converted from cross flow action
  name: <Original Step Name>
```

### 4. Schema Transformation

- **Integration Schema**: `definitionVersion: 7` to **Workflow Definition**: `definitionVersion: 1`
- **Definition Type**: Changes from `"integration"` to `"workflow"`
- **Flow Structure**: Each flow becomes the single flow in a WorkflowDefinition
- **Retry Config**: Preserved if present in the original flow
- **Step Structure**: Maintained with nested steps and branches support

## Migration Reports

### Per-Flow Reports

Each flow generates a detailed migration report containing:

- **Status**: `converted` or `skipped`
- **Conversion Statistics**: Count of removed config vars, templates, and cross-flow actions
- **Cross-Flow Details**: Original names and component keys of converted actions
- **Lossy Transformations**: List of all transformations that may require manual review
- **Management Trigger Detection**: Boolean flag if management trigger was found

### Migration Summary

Overall summary containing:

- **Integration metadata**: Name and total flow count
- **Conversion statistics**: Total converted vs skipped flows
- **All flow reports**: Array of individual flow reports

## Error Handling

The script includes comprehensive error handling for:

- **Missing input files**: Clear error message if input YAML doesn't exist
- **Invalid YAML**: Validation of integration schema structure
- **Missing output directory**: Automatically creates output directory structure
- **File system errors**: Graceful handling of write permissions and disk space issues

## Example Migration

Given an integration with these flows:

1. **Customer Sync** (regular flow) -> Converted to `customer-sync.yml`
2. **Management Setup** (management trigger) -> Skipped, documented in report
3. **Order Processing** (with cross-flow action) -> Converted to `order-processing.yml` with cross-flow actions replaced

The tool will:

- Generate 2 workflow YAML files
- Create 3 migration reports (one per flow)
- Generate 1 migration summary
- Display console output showing conversion status and warnings

## Testing

A sample integration schema is provided in `sample-integration.yml` for testing:

```bash
npm run migrate sample-integration.yml ./test-output
```

This demonstrates all major migration features including configuration removal, management trigger detection, and cross-flow action conversion.

## Dependencies

- **Node.js**: Runtime environment
- **TypeScript**: Development language
- **js-yaml**: YAML parsing and generation
- **@types/node**: TypeScript definitions for Node.js
- **@types/js-yaml**: TypeScript definitions for js-yaml

## Development

### Build the project:

```bash
npm run build
```

### Run the migration:

```bash
npm run migrate
```

The source code includes comprehensive TypeScript types and follows the existing schema definitions in `integrationSchema.ts` and `workflowSchema.ts`.

## Importing workflows

After generating a workflow YAML file, you can import it into the Prismatic platform using the CLI:

```bash
prism workflows:import --path output/my-integration/my-flow.yml
```

This will import the workflow as a _template_.
If you would like to import the workflow directly for a specific customer, you can specify the `--customer` flag:

```bash
prism workflows:import --path output/my-integration/my-flow.yml --customer Q3VzEXAMPLE
```
