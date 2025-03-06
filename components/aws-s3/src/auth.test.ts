const s3Mock = jest.fn();

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: s3Mock,
  };
});

jest.mock("aws-utils", () => {
  return {
    assumeRoleConnection: {
      key: "awsAssumeRole",
    },
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

    test("throws error if invalid credentials provided", async () => {
      const connection = createConnection(accessKeySecretPair, {
        accessKeyId: "fakeKey",
        secretAccessKey: "fakeKey",
      });
      try {
        await createS3Client({
          awsConnection: connection,
          awsRegion: "us-east-2",
          dynamicAccessKeyId: "",
          dynamicSecretAccessKey: "",
          dynamicSessionToken: undefined,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ConnectionError);
      }
    });
  });

  describe("valid credentials", () => {
    beforeAll(() => {
      s3Mock.mockResolvedValue("foo");
    });

    test("returns S3 client with api key secret credentials", async () => {
      await createS3Client({
        awsConnection: createConnection(accessKeySecretPair, {
          accessKeyId: "fakeKey",
          secretAccessKey: "fakeKey",
        }),
        awsRegion: "us-east-2",
        dynamicAccessKeyId: "",
        dynamicSecretAccessKey: "",
        dynamicSessionToken: undefined,
      });
      expect(s3Mock).toHaveBeenCalled();
    });
  });
});
