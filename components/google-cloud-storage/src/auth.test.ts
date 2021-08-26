import { authorization, googleStorageClient } from "./auth";
import {
  credentials,
  getAuthorizationMethods,
} from "@prismatic-io/spectral/dist/testing";

describe("googleStorageClient", () => {
  test("returns client with private key credentials", () => {
    const expectedUsername = "user";
    const expectedPrivateKey = "private";
    const credential = credentials.privateKey(
      expectedUsername,
      expectedPrivateKey
    );
    expect(googleStorageClient(credential, "foo")).not.toBeUndefined();
  });

  test("throws error for unsupported authorization methods", () => {
    const invalidMethods = getAuthorizationMethods(authorization.methods);
    for (const method of invalidMethods) {
      expect(() =>
        googleStorageClient(credentials.generate(method), "foo")
      ).toThrow(/Unsupported authorization method/);
    }
  });
});
