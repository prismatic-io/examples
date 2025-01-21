import listDirectory from "./listActions";
import { basic } from "./connections";
import { invoke, createConnection } from "@prismatic-io/spectral/dist/testing";

describe("listActions", () => {
  test("Verify SFTP can list files in a directory", async () => {
    const connection = createConnection(basic, {
      username: "demo",
      password: "demo",
      host: "demo.wftpserver.com",
      port: "2222",
    });
    const path = "/download/";
    const pattern = "*.jpg";
    const expectedResults = [
      "Spring.jpg",
      "Summer.jpg",
      "Winter.jpg",
      "Autumn.jpg",
    ];
    listDirectory.perform = jest
      .fn()
      .mockResolvedValue({ data: expectedResults });
    const { result } = await invoke(listDirectory, {
      connection,
      path,
      pattern,
      debug: false,
    });
    expect(result.data.sort()).toStrictEqual(expectedResults.sort());
  }, 20000);
});
