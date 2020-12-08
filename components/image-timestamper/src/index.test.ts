import fs from "fs";
import tempfile from "tempfile";
import { timestampAction } from "./index";
import { PerformDataReturn } from "@prismatic-io/spectral";

test("Test addition of timestamp", async () => {
  const testImage = fs.readFileSync("src/test-image.png");
  const output = (await timestampAction.timestampImage.perform(null, {
    image: { data: testImage, contentType: "image/png" },
  })) as PerformDataReturn;
  fs.writeFileSync("test-output.png", output.data as string);
});
