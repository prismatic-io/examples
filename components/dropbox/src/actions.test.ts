import { createHarness } from "@prismatic-io/spectral/dist/testing";
import { oauthConnection } from "./connections";
import component from ".";

// Initialize a testing harness
const harness = createHarness(component);

// Parse the OAuth 2.0 connection from the PRISMATIC_CONNECTION_VALUE environment variable
const parsedConnection = harness.connectionValue(oauthConnection);

describe("listFolder", () => {
  test("listRootFolder", async () => {
    const result = await harness.action("listFolder", {
      dropboxConnection: parsedConnection, // Pass in our connection
      path: "/",
    });
    const files = result["data"]["result"]["entries"];
    // Verify a folder named "Public" exists in the response
    expect(files).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Public" })])
    );
  });
});
