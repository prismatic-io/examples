import {
  createConnection,
  createHarness,
  invokeDataSource,
} from "@prismatic-io/spectral/dist/testing";
import { apiKey } from "./connections";
import { fieldMappingSource, fieldMappingSourceNoInput } from "./dataSources";

const apiKeyTest = createConnection(apiKey, {
  apiKey: "FpKdxbJNyYDRkaAXiRnPd19byviGb7WFVXRe7BU7TwXk",
});

describe("test field mapping form", () => {
  test("validate form fields as input", async () => {
    const res = await invokeDataSource(fieldMappingSource, {
      selectedObjects: [
        {
          object: { key: "ThirdPartyObject" },
          fields: [{ key: "_id", label: "ID" }],
        },
      ],
      sourceFields: [{ key: "videoId", value: "Video ID" }],
    });
    console.log(JSON.stringify(res, undefined, 2));
  });
  test("validate form fields without input - api call", async () => {
    const res = await invokeDataSource(fieldMappingSourceNoInput, {
      connection: apiKeyTest,
      selectedObjects: [
        {
          object: { key: "ThirdPartyObject" },
          fields: [{ key: "_id", label: "ID" }],
        },
      ],
    });
    console.log(JSON.stringify(res, undefined, 2));
  });
});
