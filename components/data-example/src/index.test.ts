import { myAction } from ".";
import { PerformDataReturn } from "@prismatic-io/spectral";
import { invoke } from "@prismatic-io/spectral/dist/testing";

describe("test my action", () => {
  test("verify the return value of my action", async () => {
    const sampleInputData = {
      productName: "Widget",
      price: 1.25,
      quantity: 75,
    };
    const expectedOutput = "This is an invoice for 75 Widgets at price $1.25. Total price: $93.75";
    const { result } = await invoke<PerformDataReturn>(myAction, {
      pointOfSale: sampleInputData,
    });
    expect(result.data).toBe(expectedOutput);
  });
});
