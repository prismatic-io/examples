import { gallonsToPoundsAction, poundsToGallonsAction } from ".";
import { PerformDataReturn } from "@prismatic-io/spectral";

test("Convert pounds to gallons", async () => {
  const output = (await poundsToGallonsAction.poundsToGallons.perform(null, {
    fuelType: "Kerosene",
    fuelAmount: 100,
  })) as PerformDataReturn;
  expect(output.data).toBeCloseTo(14.97006, 5);
});

test("Convert gallons to pounds", async () => {
  const output = (await gallonsToPoundsAction.gallonsToPounds.perform(null, {
    fuelType: "Hydrazine",
    fuelAmount: 50,
  })) as PerformDataReturn;
  expect(output.data).toBeCloseTo(419.0, 5);
});
