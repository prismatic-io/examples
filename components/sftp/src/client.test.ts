import { getAuthParams } from "./client";
import { basic, privateKey } from "./connections";
import { createConnection } from "@prismatic-io/spectral/dist/testing";

describe("getAuthParams", () => {
  test("returns params with basic credentials", () => {
    const expectedUsername = "user";
    const expectedPassword = "pass";
    const connection = createConnection(basic, {
      username: expectedUsername,
      password: expectedPassword,
    });
    expect(getAuthParams(connection)).toStrictEqual({
      username: expectedUsername,
      password: expectedPassword,
    });
  });

  test("returns params with private key credentials with no passphrase", () => {
    const expectedUsername = "user";
    const expectedPrivateKey = "private";
    const connection = createConnection(privateKey, {
      username: expectedUsername,
      privateKey: expectedPrivateKey,
    });
    expect(getAuthParams(connection)).toStrictEqual({
      username: expectedUsername,
      privateKey: expectedPrivateKey,
      passphrase: "",
      password: "",
    });
  });

  test("returns params with private key credentials with passphrase", () => {
    const expectedUsername = "user";
    const expectedPrivateKey = "private";
    const expectedPassphrase = "passphrase";

    const connection = createConnection(privateKey, {
      username: expectedUsername,
      privateKey: expectedPrivateKey,
      passphrase: expectedPassphrase,
    });
    expect(getAuthParams(connection)).toStrictEqual({
      username: expectedUsername,
      privateKey: expectedPrivateKey,
      passphrase: expectedPassphrase,
      password: "",
    });
  });
});
