import generateSignature from "./signature";
import { verifySignature } from "./actions";
import { invoke } from "@prismatic-io/spectral/dist/testing";

const body = '{"fuelUsed":[{"type":"Kerosene","pounds":"1357964"},{"type":"O2","pounds":"3028029"}]}';
const secret = "prismatic";
const expectedSignature = "55B4B047441061E620FE3F6D154D8298B7F5D86A";

describe("verifySignature", () => {
  test("ensure calculated signature matches expected signature", () => {
    const calculatedSignature = generateSignature(secret, body);
    expect(calculatedSignature).toStrictEqual(expectedSignature);
  });
  test("ensure action works as expected", async () => {
    const { result } = await invoke(verifySignature,       {
      signature: expectedSignature,
      body,
      secret,
    });
  });
});
