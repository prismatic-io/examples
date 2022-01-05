const getCallerIdentityMock = jest.fn();
const snsMock = jest.fn();
import { createSNSClient } from "./client";
import { createConnection } from "@prismatic-io/spectral/dist/testing";
import { accessKeySecretPair } from "./connections";

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
        createSNSClient({
          awsConnection: createConnection(accessKeySecretPair, {}),
          awsRegion: "us-east-2",
        })
      ).rejects.toThrow();
    });
  });

  describe("valid credentials", () => {
    beforeAll(() => {
      getCallerIdentityMock.mockResolvedValue("foo");
    });

    test("returns SNS client with api key secret credentials", async () => {
      await createSNSClient({
        awsConnection: createConnection(accessKeySecretPair, {}),
        awsRegion: "us-east-2",
      });
      expect(snsMock).toHaveBeenCalled();
    });
  });
});
