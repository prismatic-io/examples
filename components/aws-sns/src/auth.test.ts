const getCallerIdentityMock = jest.fn();
const snsMock = jest.fn();
import { authorization, createSNSClient } from "./auth";
import {
  credentials,
  getAuthorizationMethods,
} from "@prismatic-io/spectral/dist/testing";

jest.mock("aws-sdk", () => {
  return {
    STS: jest.fn(() => ({
      getCallerIdentity: jest.fn().mockImplementation(() => ({
        promise: getCallerIdentityMock,
      })),
    })),
    SNS: snsMock,
  };
});

describe("createSNSClient", () => {
  describe("invalid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockRejectedValue("Invalid!");
    });

    test("throws error if invalid credentials provided", async () => {
      await expect(
        createSNSClient(credentials.generate("api_key_secret"), "us-east-2")
      ).rejects.toThrow();
    });
  });

  describe("valid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockResolvedValue("foo");
    });

    test("returns SNS client with api key secret credentials", async () => {
      const credential = credentials.apiKeySecret("foo", "bar");
      await createSNSClient(credential, "us-east-2");
      expect(snsMock).toHaveBeenCalled();
    });

    test("throws error for unsupported authorization methods", async () => {
      const invalidMethods = getAuthorizationMethods(authorization.methods);
      for (const method of invalidMethods) {
        await expect(
          createSNSClient(credentials.generate(method), "us-east-2")
        ).rejects.toThrowError(/Unsupported authorization method/);
      }
    });
  });
});
