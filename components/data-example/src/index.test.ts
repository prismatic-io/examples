import component from ".";
import { ComponentTestHarness } from "@prismatic-io/spectral/dist/testing";

const harness = new ComponentTestHarness(component);

describe("test my action", () => {
  test("verify the return value of my action", async () => {
    const sampleInputData = {
      productName: "Widget",
      price: 1.25,
      quantity: 75,
    };
    const expectedOutput =
      "This is an invoice for 75 Widgets at price $1.25. Total price: $93.75";
    const result = await harness.action("myAction", {
      pointOfSale: sampleInputData,
    });
    expect(result.data).toBe(expectedOutput);
  });

  test("verify that you can also pass in a JSON string", async () => {
    const sampleInputJson =
      '{"productName":"Widget","price":1.25,"quantity":75}';
    const expectedOutput =
      "This is an invoice for 75 Widgets at price $1.25. Total price: $93.75";
    const result = await harness.action("myAction", {
      pointOfSale: sampleInputJson,
    });
    expect(result.data).toBe(expectedOutput);
  });

  test("verify that an error is thrown when data is not formatted correctly", async () => {
    const sampleInputData = {
      productName: "Widget",
      price: 1.25,
      amount: 75, // Not "quantity"
    };
    expect(async () => {
      await harness.action("myAction", {
        pointOfSale: sampleInputData,
      });
    }).rejects.toThrow();
  });
});
