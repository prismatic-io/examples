const getCallerIdentityMock = jest.fn();
const s3Mock = jest.fn();

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: s3Mock,
  };
});

import { ConnectionError } from "@prismatic-io/spectral";
import { createS3Client } from "./auth";
import { accessKeySecretPair } from "./connections";
import { createConnection } from "@prismatic-io/spectral/dist/testing";

describe("createS3Client", () => {
  describe("invalid credentials", () => {
    beforeAll(() => {
      s3Mock.mockImplementationOnce(() => {
        throw new Error("!Invalid");
      });
    });

    test("throws error if invalid credentials provided", () => {
      const connection = createConnection(accessKeySecretPair, {
        accessKeyId: "fakeKey",
        secretAccessKey: "fakeKey",
      });
      try {
        createS3Client(connection, "us-east-2");
      } catch (error) {
        expect(error).toBeInstanceOf(ConnectionError);
      }
    });
  });

  describe("valid credentials", () => {
    beforeAll(() => {
      s3Mock.mockResolvedValue("foo");
    });

    test("returns S3 client with api key secret credentials", () => {
      createS3Client(
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
