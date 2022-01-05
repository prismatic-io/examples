import { googleStorageClient } from "./client";
import { googleConnection } from "./connections";
import { createConnection } from "@prismatic-io/spectral/dist/testing";

describe("googleStorageClient", () => {
  test("returns client with private key credentials", () => {
    const connection = createConnection(googleConnection, {
      privateKey: "",
      clientEmail: "",
      projectId: "",
    });
    expect(googleStorageClient(connection)).not.toBeUndefined();
  });

  test("throws error for unsupported authorization methods", () => {
    expect(() =>
      googleStorageClient(
        createConnection({ inputs: {}, key: "fakeConnection", label: "" }, {})
      )
    ).toThrow(/Unsupported authorization method/);
  });
});
