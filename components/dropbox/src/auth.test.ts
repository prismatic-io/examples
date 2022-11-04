import { createAuthorizedClient } from "./auth";
import { oauthConnection } from "./connections";
import { Connection } from "@prismatic-io/spectral";

// Parse the OAuth 2.0 connection from the PRISMATIC_CONNECTION_VALUE environment variable
const parsedConnection = JSON.parse(process.env.PRISMATIC_CONNECTION_VALUE);

describe("createAuthorizedClient", () => {
  test("returns client with oauth2 credentials", () => {
    const myConnection: Connection = {
      configVarKey: "test",
      key: oauthConnection.key,
      fields: {},
      token: {
        access_token: parsedConnection.token.access_token,
      },
    };
    expect(createAuthorizedClient(myConnection)).not.toBeUndefined();
  });
});
