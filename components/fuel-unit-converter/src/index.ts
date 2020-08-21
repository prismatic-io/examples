import { action, component, input } from "@prismatic-io/spectral";
import { version } from "../package.json";

const fuelTypeInputField = input({
  key: "fuelType",
  label: "Fuel Type",
  type: "string",
  placeholder: "e.g. Hydrazine, Kerosene, etc.",
});

const fuelAmountInputField = input({
  key: "fuelAmount",
  label: "Fuel Amount",
  type: "string",
  placeholder: "Fuel amount to be converted in gallons or pounds",
});

const gallonsToPoundsConversion = {
  Hydrazine: 8.38,
  Kerosene: 6.68,
  Nitromethane: 9.49,
  O2: 9.52,
};

export const gallonsToPoundsAction = action({
  key: "gallonsToPounds",
  display: {
    label: "Gallons to pounds",
    description: "Convert gallons of fuel to pounds of fuel",
  },
  inputs: [fuelTypeInputField, fuelAmountInputField],
  perform: async (context, { fuelType, fuelAmount }) => {
    if (!(fuelType in gallonsToPoundsConversion)) {
      throw Error(`${fuelType} is not a valid fuel type.`);
    }
    return {
      data: fuelAmount * gallonsToPoundsConversion[fuelType],
    };
  },
});

export const poundsToGallonsAction = action({
  key: "poundsToGallons",
  display: {
    label: "Pounds to gallons",
    description: "Convert pounds of fuel to gallons of fuel",
  },
  inputs: [fuelTypeInputField, fuelAmountInputField],
  perform: async (context, { fuelType, fuelAmount }) => {
    if (!(fuelType in gallonsToPoundsConversion)) {
      throw Error(`${fuelType} is not a valid fuel type.`);
    }
    return {
      data: fuelAmount / gallonsToPoundsConversion[fuelType],
    };
  },
});

export default component({
  key: "fuel-unit-converter",
  public: false,
  version,
  display: {
    label: "Convert units",
    description: "Convert units of fuel between gallons and pounds",
    iconPath: "icon.png",
  },
  actions: { ...gallonsToPoundsAction, ...poundsToGallonsAction },
});
