import { gallonsToPounds, poundsToGallons } from ".";
import { invoke } from "@prismatic-io/spectral/dist/testing";

test("Convert pounds to gallons", async () => {
  const { result } = await invoke(poundsToGallons, {
    fuelType: "Kerosene",
    fuelAmount: 100,
  });
  expect(result.data).toBeCloseTo(14.97006, 6);
});

test("Convert gallons to pounds", async () => {
  const { result } = await invoke(gallonsToPounds, {
    fuelType: "Hydrazine",
    fuelAmount: 50,
  });
  expect(result.data).toBeCloseTo(419.0, 5);
});
