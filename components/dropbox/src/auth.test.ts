import { createAuthorizedClient } from "./auth";
import { createConnection } from "@prismatic-io/spectral/dist/testing";
import { oauthConnection } from "./connections";

describe("createAuthorizedClient", () => {
  test("returns client with oauth2 credentials", () => {
    const myConnection = createConnection(oauthConnection, {
      access_token: "test",
    });
    expect(createAuthorizedClient(myConnection)).not.toBeUndefined();
  });
});
