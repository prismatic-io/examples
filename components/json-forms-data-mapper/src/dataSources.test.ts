import { createHarness } from "@prismatic-io/spectral/dist/testing";
import component from ".";

const harness = createHarness(component);

/** Create Connections */
const jiraAccessToken = process.env.JIRA_ACCESS_TOKEN;
const jiraConnection = { token: { access_token: jiraAccessToken } };
const acmeConnection = { fields: { apiKey: "abc-123" } };

describe("Print JSON form data", () => {
  test("Print JSON schema and UI schema", async () => {
    const jiraProjectIds = [
      { object: { label: "TP - Test Project", key: "10000" } },
      { object: { label: "THIR - Third Project", key: "10002" } },
    ];

    const result = await harness.dataSource("jiraExampleJsonForms", {
      jiraConnection,
      acmeConnection,
      jiraProjectIds,
    });
    // Print out schema for testing in https://prismatic.io/docs/jsonforms/playground/
    console.log(JSON.stringify(result.result, null, 2));
  });
});
