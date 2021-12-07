import { invoke, createConnection } from "@prismatic-io/spectral/dist/testing";
import { apiKeyConnection } from "./connections";
import actions from "./actions";

const acmeConnection = createConnection(apiKeyConnection, {
  endpoint: "https://my-json-server.typicode.com/prismatic-io/placeholder-data",
  apiKey: process.env.ACME_ERP_API_KEY, // Get API key from an environment variable
});

describe("test the add item action", () => {
  test("test that we get back what we sent", async () => {
    const name = "widgets";
    const quantity = 123;
    const { result } = await invoke(
      actions.addItem, // Invoke the "addItem" action
      { acmeConnection, name, quantity } // Pass in some inputs that we declared
    );
    expect(result.data.name).toEqual(name); // Verify that the response had the same item name
    expect(result.data.quantity).toEqual(quantity); // Verify that the response had the same item quantity
  });
});
