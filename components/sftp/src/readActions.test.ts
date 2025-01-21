import readActions from "./readActions";
import { basic } from "./connections";
import { invoke, createConnection } from "@prismatic-io/spectral/dist/testing";

describe("statFile", () => {
  test("Verify SFTP can list files in a directory", async () => {
    const connection = createConnection(basic, {
      username: "demo",
      password: "demo",
      host: "demo.wftpserver.com",
      port: "2222",
    });
    const inputPath = "/download/Spring.jpg";
    const expectedResults = {
      mode: 33206, // integer representing type and permissions
      uid: 0, // user ID
      gid: 0, // group ID
      size: 867573, // file size
      accessTime: 1585061591000, // Last access time. milliseconds
      modifyTime: 1585061591000, // last modify time. milliseconds
      isDirectory: false, // true if object is a directory
      isFile: true, // true if object is a file
      isBlockDevice: false, // true if object is a block device
      isCharacterDevice: false, // true if object is a character device
      isSymbolicLink: false, // true if object is a symbolic link
      isFIFO: false, // true if object is a FIFO
      isSocket: false, // true if object is a socket
    };
    readActions.statFile.perform = jest
      .fn()
      .mockResolvedValue({ data: expectedResults });
    const { result } = await invoke(readActions.statFile, {
      connection,
      inputPath,
      debug: false,
    });
    expect(result.data).toStrictEqual(expectedResults);
  }, 20000);
});
