import { action, component, input, util } from "@prismatic-io/spectral";

const fuelTypeInputField = input({
  label: "Fuel Type",
  type: "string",
  placeholder: "Type of Fuel",
  example: "Hydrazine",
});

const fuelAmountInputField = input({
  label: "Fuel Amount",
  type: "string",
  placeholder: "Fuel amount to be converted in gallons or pounds",
  example: "100",
});

const gallonsToPoundsConversion = {
  Hydrazine: 8.38,
  Kerosene: 6.68,
  Nitromethane: 9.49,
  O2: 9.52,
};

export const gallonsToPounds = action({
  display: {
    label: "Gallons to pounds",
    description: "Convert gallons of fuel to pounds of fuel",
  },
  inputs: { fuelType: fuelTypeInputField, fuelAmount: fuelAmountInputField },
  perform: async ({ logger }, { fuelType, fuelAmount }) => {
    const fuelTypeString = util.types.toString(fuelType);
    const fuleAmountNumber = util.types.toNumber(fuelAmount);
    logger.info(
      `Converting ${fuleAmountNumber} gallons of ${fuelTypeString} to pounds.`
    );
    if (!(fuelTypeString in gallonsToPoundsConversion)) {
      throw Error(`${fuelType} is not a valid fuel type.`);
    }
    if (fuleAmountNumber < 0) {
      logger.warn(
        `Received a negative amount of fuel. That is likely incorrect.`
      );
    }
    return {
      data:
        fuleAmountNumber *
        gallonsToPoundsConversion[util.types.toString(fuelTypeString)],
    };
  },
});

export const poundsToGallons = action({
  display: {
    label: "Pounds to gallons",
    description: "Convert pounds of fuel to gallons of fuel",
  },
  inputs: { fuelType: fuelTypeInputField, fuelAmount: fuelAmountInputField },
  perform: async ({ logger }, { fuelType, fuelAmount }) => {
    const fuelTypeString = util.types.toString(fuelType);
    const fuleAmountNumber = util.types.toNumber(fuelAmount);
    logger.info(`Converting ${fuelAmount} pounds of ${fuelType} to gallons.`);
    if (!(fuelTypeString in gallonsToPoundsConversion)) {
      throw Error(`${fuelType} is not a valid fuel type.`);
    }
    if (fuleAmountNumber < 0) {
      logger.warn(
        `Received a negative amount of fuel. That is likely incorrect.`
      );
    }
    return {
      data: fuleAmountNumber / gallonsToPoundsConversion[fuelTypeString],
    };
  },
});

export default component({
  key: "fuel-unit-converter",
  public: false,
  display: {
    label: "Convert units",
    description: "Convert units of fuel between gallons and pounds",
    iconPath: "icon.png",
  },
  actions: { gallonsToPounds, poundsToGallons },
});
