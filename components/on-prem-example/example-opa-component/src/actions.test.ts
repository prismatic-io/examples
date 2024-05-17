import {
  createConnection,
  createHarness,
} from "@prismatic-io/spectral/dist/testing";
import { exampleOpaConnection } from "./connections";
import myComponent from ".";

const harness = createHarness(myComponent);
const connection = createConnection(exampleOpaConnection, {
  apiKey: "abc-123",
  endpoint: "https://api.example.com",
  host: "127.0.0.1",
  port: "3000",
});

describe("Test on-prem connection", () => {
  test("Test passing host and port through connection", async () => {
    const result = await harness.action("exampleAction", { connection });
    expect(result?.data).toEqual({
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    });
  });
});
