import generateSignature from "./signature";

describe("verifySignature", () => {
  test("ensure calculated signature matches expected signature", () => {
    const body =
      '{"fuelUsed":[{"type":"Kerosene","pounds":"1357964"},{"type":"O2","pounds":"3028029"}]}';
    const secret = "prismatic";
    const expectedSignature = "55B4B047441061E620FE3F6D154D8298B7F5D86A";
    const calculatedSignature = generateSignature(secret, body);

    expect(calculatedSignature).toStrictEqual(expectedSignature);
  });
});
