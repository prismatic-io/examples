import { createConnection, invoke } from "@prismatic-io/spectral/dist/testing";
import { sayHello } from "./actions";
import { myConnection } from "./connections";

describe("test my action", () => {
  test("verify the return value of my action", async () => {
    const { result } = await invoke(sayHello, {
      connection: createConnection(myConnection, {
        username: "myuser",
        password: "mypass",
      }),
      name: "John Doe",
    });
    expect(result.data).toEqual({ reply: "hello John Doe" });
  });
});
