import { action, component, input } from "@prismatic-io/spectral";

const pointOfSaleInput = input({
  label: "pointOfSaleInput",
  type: "data",
  required: true,
  comments:
    "Ensure the input is a deserialized object of the form { productName: string, price: number, quantity: number }.",
  example: "{ productName: 'Widget', price: 1.25, quantity: 75 }",
});

interface PointOfSaleType {
  productName: string,
  price: number,
  quantity: number
}

export const myAction = action({
  display: {
    label: "My Action",
    description: "Sample action that takes a complex data structure.",
  },
  perform: async (
    context,
    params,
  ) => {
    const { productName, quantity, price } = params.pointOfSale as PointOfSaleType;
    return {
      data: `This is an invoice for ${quantity} ${productName}s at price $${price}. Total price: $${price * quantity}`,
    };
  },
  inputs: {pointOfSale: pointOfSaleInput},
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
