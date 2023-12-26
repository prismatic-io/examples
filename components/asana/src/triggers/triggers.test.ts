import {
  createHarness,
  createConnection,
} from "@prismatic-io/spectral/dist/testing";
import { asanaApiKeyConnection } from "../connections";
import component from "..";

jest.setTimeout(30000);

/**
 * This test assumes that three environment variables are set:
 * - ASANA_API_KEY: An Asana API key
 * - ASANA_WORKSPACE_ID: The ID of a workspace to use for testing
 * - TRIGGER_ENDPOINT: The endpoint where Asana should send webhook requests
 */

const harness = createHarness(component);
const asanaConnection = createConnection(asanaApiKeyConnection, {
  apiKey: process.env.ASANA_API_KEY,
});
const WORKSPACE_ID = process.env.ASANA_WORKSPACE_ID;
const TRIGGER_ENDPOINT = `${process.env.TRIGGER_ENDPOINT}`;

describe("Test event triggers", () => {
  test("Workspace Projects Trigger Setup", async () => {
    const result = await harness.triggerOnInstanceDeploy(
      "workspaceProjectsTrigger",
      { asanaConnection, workspaceId: WORKSPACE_ID },
      {
        webhookUrls: { myFlow: TRIGGER_ENDPOINT },
        flow: { id: "myId", name: "myFlow" },
      }
    );
    console.log({ result });
  });

  // test("Workspace Projects Trigger Tear Down", async () => {
  //   const result = await harness.triggerOnInstanceDelete(
  //     "workspaceProjectsTrigger",
  //     { asanaConnection, workspaceId: WORKSPACE_ID },
  //     {
  //       webhookUrls: { myFlow: TRIGGER_ENDPOINT },
  //       flow: { id: "myId", name: "myFlow" },
  //     }
  //   );
  //   console.log({ result });
  // });
});
