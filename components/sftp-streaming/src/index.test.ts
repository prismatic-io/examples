import {
  createConnection,
  createHarness,
} from "@prismatic-io/spectral/dist/testing";
import myComponent, { basic } from ".";

jest.setTimeout(60000);

const harness = createHarness(myComponent);
const connection = createConnection(basic, {
  username: "foo",
  password: "pass",
  host: "localhost",
  port: 1234,
});

test("Pull down big file", async () => {
  const sourceUrl =
    "https://uc5b7ed52ce467cd084e85080947.dl.dropboxusercontent.com/cd/0/inline/CZI4wkQHI5N_SlWdH8qxLJFKbkv3CxwvY-L7KYGmrvGilmh70_VFm8j3wKWX6mUqP9oKtocx8rskBGgZou0CvNiVkfJKRXtOClK5zvK9Nl23hfi82hl19ttZCGHzLvXrqKEGheSKG77dQSMP3eI-8_Lg/file#";
  const sftpPath = "/upload/move.mov";
  const result = await harness.action("uploadFileFromUrl", {
    connection,
    sourceUrl,
    sftpPath,
  });
  console.log({ result });
});
