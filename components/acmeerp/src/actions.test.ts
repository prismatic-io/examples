import { invoke, credentials } from "@prismatic-io/spectral/dist/testing";
import actions from "./actions";

const credential = credentials.apiKey(
  process.env.ACME_ERP_API_KEY // Get API key from an environment variable
);

describe("test the add item action", () => {
  test("test that we get back what we sent", async () => {
    const endpointUrl = "https://acmeerp.mycompany.com/api";
    const name = "widgets";
    const quantity = 123;
    const { result } = await invoke(
      actions.addItem, // Invoke the "addItem" action
      { endpointUrl, name, quantity }, // Pass in some inputs that we declared
      { credential } // Pass in a valid credential to use for testing
    );
    expect(result.data.name).toEqual(name); // Verify that the response had the same item name
    expect(result.data.quantity).toEqual(quantity); // Verify that the response had the same item quantity
  });
});
