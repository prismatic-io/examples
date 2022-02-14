import { googleStorageClient } from "./client";
import { googleConnection } from "./connections";
import { createConnection } from "@prismatic-io/spectral/dist/testing";

describe("googleStorageClient", () => {
  test("returns client with connection", () => {
    const connection = createConnection(googleConnection, {
      privateKey: "",
      clientEmail: "",
      projectId: "",
    });
    expect(googleStorageClient(connection)).toBeDefined();
  });

  test("throws error for unexpected connections", () => {
    expect(() =>
      googleStorageClient(
        createConnection({ inputs: {}, key: "fakeConnection", label: "" }, {})
      )
    ).toThrow(/Unknown Connection type provided/);
  });
});
