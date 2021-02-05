import generateSignature from "./signature";
import { verifySignature } from "./actions";

const logger = console;

const body = '{"fuelUsed":[{"type":"Kerosene","pounds":"1357964"},{"type":"O2","pounds":"3028029"}]}';
const secret = "prismatic";
const expectedSignature = "55B4B047441061E620FE3F6D154D8298B7F5D86A";

describe("verifySignature", () => {
  test("ensure calculated signature matches expected signature", () => {
    const calculatedSignature = generateSignature(secret, body);
    expect(calculatedSignature).toStrictEqual(expectedSignature);
  });
  test("ensure action works as expected", () => {
    verifySignature.verifySignature.perform(
      { logger },
      {
        signature: expectedSignature,
        body,
        secret,
      }
    );
  });
});
