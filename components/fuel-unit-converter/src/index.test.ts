import { gallonsToPoundsAction, poundsToGallonsAction } from ".";
import { PerformDataReturn } from "@prismatic-io/spectral";
import { invoke } from "@prismatic-io/spectral/dist/testing";

test("Convert pounds to gallons", async () => {
  const { result } = await invoke<PerformDataReturn>(poundsToGallonsAction, {
    fuelType: "Kerosene",
    fuelAmount: 100,
  });
  expect(result.data).toBeCloseTo(14.97006, 6);
});

test("Convert gallons to pounds", async () => {
  const { result } = await invoke<PerformDataReturn>(gallonsToPoundsAction, {
    fuelType: "Hydrazine",
    fuelAmount: 50,
  });
  expect(result.data).toBeCloseTo(419.0, 5);
});
