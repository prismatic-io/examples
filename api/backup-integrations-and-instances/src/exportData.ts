import cliProgress from "cli-progress";
import fs from "fs";
import getIntegrations from "./getIntegrations";
import path from "path";
import slugify from "slugify";
import YAML from "yaml";
import writeAvatarFile from "./writeAvatarFile";
import getInstancesByIntegration from "./getInstances";

async function exportData() {
  const backupDirectory = path.join(__dirname, "..", "backups");
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }

  const multibar = new cliProgress.MultiBar(
    {
      format: "{bar} | {percentage}% | {value}/{total} || {title}",
      emptyOnZero: true,
    },
    cliProgress.Presets.shades_classic
  );
  const integrationMetadata = multibar.create(0, 0, {
    title: "Fetch Integration Metadata",
  });
  const integrationProgressBar = multibar.create(0, 0, {
    title: "Process Integrations",
  });
  const instanceProgressBar = multibar.create(0, 0, {
    title: "Process Instances",
  });

  const integrations = await getIntegrations(integrationMetadata);

  integrationProgressBar.setTotal(integrations.length);
  instanceProgressBar.setTotal(
    integrations.reduce(
      (acc, integration) => acc + integration.instances.totalCount,
      0
    )
  );

  for (const integration of integrations) {
    const integrationDirectory = path.join(
      backupDirectory,
      `${slugify(integration.name)} - ${integration.id}}`
    );
    if (!fs.existsSync(integrationDirectory)) {
      fs.mkdirSync(integrationDirectory);
    }
    const { definition, avatarUrl, ...metadata } = integration;

    fs.writeFileSync(
      path.join(integrationDirectory, "metadata.json"),
      JSON.stringify(metadata, null, 2)
    );

    if (avatarUrl) {
      await writeAvatarFile(
        avatarUrl,
        path.join(integrationDirectory, "icon.png")
      );
    }

    const parsedDefinition = YAML.parse(definition);
    fs.writeFileSync(
      path.join(integrationDirectory, "integration.yaml"),
      YAML.stringify(parsedDefinition)
    );

    if (integration.instances.totalCount) {
      const instances = await getInstancesByIntegration(integration.id);
      const instancesDirectory = path.join(integrationDirectory, "instances");
      if (!fs.existsSync(instancesDirectory)) {
        fs.mkdirSync(instancesDirectory);
      }
      for (const instance of instances) {
        fs.writeFileSync(
          path.join(instancesDirectory, `${instance.id}.json`),
          JSON.stringify(instance, null, 2)
        );
        instanceProgressBar.increment();
      }
    }

    integrationProgressBar.increment();
  }

  fs.writeFileSync(
    path.join(backupDirectory, "metadata.json"),
    JSON.stringify({
      integrationCount: integrationProgressBar.getTotal(),
      instanceCount: instanceProgressBar.getTotal(),
    })
  );

  multibar.stop();
}

export default exportData;
