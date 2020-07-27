import { action, component, input } from "@prismatic-io/spectral";
import { version } from "../package.json";

/* Inputs are shared between actions */
export const firstNumberInputField = input({
  key: "firstNumber",
  label: "First Number",
  type: "string",
});

export const secondNumberInputField = input({
  key: "secondNumber",
  label: "Second Number",
  type: "string",
});

/* Helper functions to compute GCD and LCM */
const gcd = (firstNumber, secondNumber) => {
  if (!secondNumber) {
    return firstNumber;
  }
  return gcd(secondNumber, firstNumber % secondNumber);
};

const lcm = (firstNumber, secondNumber) =>
  (firstNumber * secondNumber) / gcd(firstNumber, secondNumber);

/* GCD and LCM actions */
const gcdAction = action({
  key: "gcd",
  display: {
    label: "Greatest Common Denominator",
    description: "Compute the greatest common denominator of two integers",
  },
  inputs: [firstNumberInputField, secondNumberInputField],
  perform: async (context, { firstNumber, secondNumber }) => {
    if (!Number.isInteger(Number(firstNumber)) || !Number.isInteger(Number(secondNumber))) {
      throw Error(`Either ${firstNumber} or ${secondNumber} is not an integer.`)
    }
    return {
      data: gcd(firstNumber, secondNumber),
    };
  },
});

const lcmAction = action({
  key: "lcm",
  display: {
    label: "Least Common Multiple",
    description: "Compute the least common multiple of two integers",
  },
  inputs: [firstNumberInputField, secondNumberInputField],
  perform: async (context, { firstNumber, secondNumber }) => {
    if (!Number.isInteger(Number(firstNumber)) || !Number.isInteger(Number(secondNumber))) {
      throw Error(`Either ${firstNumber} or ${secondNumber} is not an integer.`)
    }
    return {
      data: lcm(firstNumber, secondNumber),
    };
  },
});

export default component({
  key: "gcd-and-lcm",
  public: false,
  version,
  display: {
    label: "Compute GCD or LCM",
    description: "Compute the GCD or LCM of two integers",
    iconPath: "icon.png",
  },
  actions: { ...gcdAction, ...lcmAction },
});
