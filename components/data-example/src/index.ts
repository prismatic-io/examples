import { action, component, input } from "@prismatic-io/spectral";
import packageInfo from "../package.json";

const version = packageInfo.version;

const pointOfSaleInput = input({
  key: "pointOfSale",
  label: "pointOfSaleInput",
  type: "data",
  required: true,
  comments:
    "Ensure the input is a deserialized object of the form { productName: string, price: number, quantity: number }.",
  example: "{ productName: 'Widget', price: 1.25, quantity: 75 }",
});

export const myAction = action({
  key: "myAction",
  display: {
    label: "My Action",
    description: "Sample action that takes a complex data structure.",
  },
  perform: async (
    context,
    { pointOfSale: { productName, price, quantity } }
  ) => {
    return {
      data: `This is an invoice for ${quantity} ${productName}s at price $${price}. Total price: $${price * quantity}`,
    };
  },
  inputs: [pointOfSaleInput],
});

export default component({
  key: "data-example",
  public: false,
  version,
  display: {
    label: "Data Structure Input Example",
    description: "Example where an input is a more complex data structure.",
    iconPath: "icon.png",
  },
  actions: { ...myAction },
});
