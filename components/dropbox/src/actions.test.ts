import { invoke, createConnection } from "@prismatic-io/spectral/dist/testing";
import actions from "./actions";
import { util } from "@prismatic-io/spectral";
import { oauthConnection } from "./connections";

interface DropboxResult {
  size: number;
  byteLength: number;
}

describe("downloadFile", () => {
  const dropboxConnection = createConnection(oauthConnection, {
    access_token: process.env.DROPBOX_TEST_TOKEN,
  });

  const path = "/Hello/World.txt";
  const expectedContents = "foo bar baz";
  let expectedSize = -1;

  beforeAll(async () => {
    const { result } = await invoke(actions.uploadFile, {
      dropboxConnection,
      path,
      fileContents: expectedContents,
    });
    const data = result.data;
    expectedSize = data.result.size;
  });

  afterAll(async () => {
    await invoke(actions.deleteObject, { dropboxConnection, path });
  });

  it("should round-trip a text file", async () => {
    const { result } = await invoke(actions.downloadFile, {
      dropboxConnection,
      path,
    });
    const data = result.data;
    expect(data.byteLength).toStrictEqual(expectedSize);
    expect(util.types.toString(data)).toStrictEqual(expectedContents);
  });
});
