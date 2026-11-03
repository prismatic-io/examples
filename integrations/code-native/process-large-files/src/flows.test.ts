import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import dotenv from "dotenv";
import { processZipFile } from "./flows";

dotenv.config({ path: ".env.testing" });

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.AWS_S3_BUCKET_NAME
) {
  throw new Error("Missing required AWS environment variables");
}

if (
  !process.env.PG_HOST ||
  !process.env.PG_PORT ||
  !process.env.PG_DATABASE ||
  !process.env.PG_USERNAME ||
  !process.env.PG_PASSWORD
) {
  throw new Error("Missing required PostgreSQL environment variables");
}

describe("Verify flow works as expected", () => {
  test("Verify we can process a zip file", async () => {
    await invokeFlow(processZipFile, {
      configVars: {
        "S3 Connection": {
          key: "apiKeySecret",
          fields: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        },
        "PostgreSQL Connection": {
          key: "postgres",
          fields: {
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            database: process.env.PG_DATABASE,
            user: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
          },
        },
        "AWS Region": `${process.env.AWS_REGION}`,
        "S3 Bucket Name": `${process.env.AWS_S3_BUCKET_NAME}`,
      },
    });
  });
});
