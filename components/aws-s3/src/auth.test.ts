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

import { createS3Client } from "./auth";
import { accessKeySecretPair } from "./connections";
import { createConnection } from "@prismatic-io/spectral/dist/testing";

describe("createS3Client", () => {
  describe("invalid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockRejectedValue("Invalid!");
    });

    test("throws error if invalid credentials provided", async () => {
      await expect(
        createS3Client(
          createConnection(accessKeySecretPair, {
            accessKeyId: "fakeKey",
            secretAccessKey: "fakeKey",
          }),
          "us-east-2"
        )
      ).rejects.toThrow(/Invalid AWS Credentials/);
    });
  });

  describe("valid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockResolvedValue("foo");
    });

    test("returns S3 client with api key secret credentials", async () => {
      await createS3Client(
        createConnection(accessKeySecretPair, {
          accessKeyId: "fakeKey",
          secretAccessKey: "fakeKey",
        }),
        "us-east-2"
      );
      expect(s3Mock).toHaveBeenCalled();
    });
  });
});
