const { faker } = require("@faker-js/faker");
const cliProgress = require("cli-progress");

const WEBHOOK_ENDPOINT = "";
const NUMBER_LEADS = 100;

async function main() {
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  progressBar.start(NUMBER_LEADS, 0);

  for (let i = 0; i < NUMBER_LEADS; i++) {
    await fetch(WEBHOOK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `acme-lead-${i + 1}`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        company: faker.company.name(),
      }),
    });
    progressBar.update(i + 1);
  }
  progressBar.stop();
}

main();
