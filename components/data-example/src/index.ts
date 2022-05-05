import { action, component, input, util } from "@prismatic-io/spectral";

const pointOfSaleInput = input({
  label: "pointOfSaleInput",
  type: "data",
  required: true,
  comments:
    "Ensure the input is a deserialized object of the form { productName: string, price: number, quantity: number }.",
  example: "{ productName: 'Widget', price: 1.25, quantity: 75 }",
  clean: (value: any) => {
    const parsedValue = util.types.isJSON(value) ? JSON.parse(value) : value;
    if (
      !(
        "productName" in parsedValue &&
        "price" in parsedValue &&
        "quantity" in parsedValue
      )
    ) {
      throw new Error("The data you input is not in the correct format");
    }
    return {
      productName: util.types.toString(parsedValue?.productName),
      price: util.types.toNumber(parsedValue?.price),
      quantity: util.types.toNumber(parsedValue?.quantity),
    };
  },
});

export const myAction = action({
  display: {
    label: "My Action",
    description: "Sample action that takes a complex data structure.",
  },
  perform: async (context, params) => {
    const { productName, quantity, price } = params.pointOfSale;
    return {
      data: `This is an invoice for ${quantity} ${productName}s at price $${price}. Total price: $${
        price * quantity
      }`,
    };
  },
  inputs: { pointOfSale: pointOfSaleInput },
});

export default component({
  key: "data-example",
  public: false,
  display: {
    label: "Data Structure Input Example",
    description: "Example where an input is a more complex data structure.",
    iconPath: "icon.png",
  },
  actions: { myAction },
});
