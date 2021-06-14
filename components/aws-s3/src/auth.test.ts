const getCallerIdentityMock = jest.fn();
const s3Mock = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    STS: jest.fn(() => ({
      getCallerIdentity: jest.fn().mockImplementation(() => ({
        promise: getCallerIdentityMock,
      })),
    })),
    S3: s3Mock,
  };
});

import { authorizationMethods, createS3Client } from "./auth";
import {
  credentials,
  getAuthorizationMethods,
} from "@prismatic-io/spectral/dist/testing";

describe("createS3Client", () => {
  describe("invalid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockRejectedValue("Invalid!");
    });

    test("throws error if invalid credentials provided", async () => {
      await expect(
        createS3Client(credentials.generate("api_key_secret"), "us-east-2")
      ).rejects.toThrow(/Invalid AWS Credentials/);
    });
  });

  describe("valid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockResolvedValue("foo");
    });

    test("returns S3 client with api key secret credentials", async () => {
      const credential = credentials.apiKeySecret("foo", "bar");
      await createS3Client(credential, "us-east-2");
      expect(s3Mock).toHaveBeenCalled();
    });

    test("throws error for unsupported authorization methods", async () => {
      const invalidMethods = getAuthorizationMethods(authorizationMethods);
      for (const method of invalidMethods) {
        await expect(
          createS3Client(credentials.generate(method), "us-east-2")
        ).rejects.toThrow(/Unsupported authorization method/);
      }
    });
  });
});
