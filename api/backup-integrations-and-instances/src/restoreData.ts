import cliProgress from "cli-progress";
import fs from "fs";
import path from "path";
import importAndPublishIntegration from "./importAndPublishIntegration";
import deployInstance from "./deployInstance";

async function restoreData() {
  const backupDirectory = path.join(__dirname, "..", "backups");
  const backupMetadata = JSON.parse(
    fs.readFileSync(path.join(backupDirectory, "metadata.json")).toString()
  );

  const multibar = new cliProgress.MultiBar(
    {
      format: "{bar} | {percentage}% | {value}/{total} || {title}",
      emptyOnZero: true,
    },
    cliProgress.Presets.shades_classic
  );
  const integrationProgressBar = multibar.create(
    backupMetadata.integrationCount,
    0,
    {
      title: "Restore Integrations",
    }
  );
  const instanceProgressBar = multibar.create(backupMetadata.instanceCount, 0, {
    title: "Restore Instances",
  });

  const integrations = fs
    .readdirSync(backupDirectory, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  for (const integration of integrations) {
    const integrationDirectory = path.join(backupDirectory, integration.name);
    const definition = fs
      .readFileSync(path.join(integrationDirectory, "integration.yaml"))
      .toString();
    const metadata = JSON.parse(
      fs
        .readFileSync(path.join(integrationDirectory, "metadata.json"))
        .toString()
    );

    const integrationVersionId = await importAndPublishIntegration({
      definition,
    });

    const instanceDirectory = path.join(integrationDirectory, "instances");
    if (fs.existsSync(instanceDirectory)) {
      for (const instanceFile of fs.readdirSync(instanceDirectory)) {
        const instance = JSON.parse(
          fs.readFileSync(path.join(instanceDirectory, instanceFile)).toString()
        );
        const customerExternalId = instance.customer.externalId;
        const instanceName = instance.name;
        const configVariables = instance.configVariables.nodes;
        await deployInstance({
          customerExternalId,
          configVariables,
          integrationVersionId,
          instanceName,
        });
        instanceProgressBar.increment();
      }
    }

    integrationProgressBar.increment();
  }

  multibar.stop();
}
export default restoreData;
