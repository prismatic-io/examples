import { action, input, util } from "@prismatic-io/spectral";
import { authorization, getAcmeErpClient } from "./auth";
import { endpointUrlInput, itemIdInput } from "./inputs";

const listAllItems = action({
  display: {
    label: "List All Items",
    description: "List all items in our inventory",
  },
  inputs: {
    // Declare some inputs for this action
    endpointUrl: endpointUrlInput,
  },
  authorization, // Require authorization for this action
  perform: async ({ credential }, { endpointUrl }) => {
    const acmeErpClient = getAcmeErpClient(
      util.types.toString(endpointUrl), // Convert our input to string, if it's not already
      credential
    );
    // Make a synchronous GET call to "{ endpointUrl }/items":
    const response = await acmeErpClient.get("/items/");

    // Return the data that we got back
    return { data: response.data };
  },
  // Show an example payload in the Prismatic UI:
  examplePayload: {
    data: [
      {
        id: 1,
        name: "Widgets",
        quantity: 20,
      },
      {
        id: 2,
        name: "Whatsits",
        quantity: 100,
      },
    ],
  },
});

const getItem = action({
  display: {
    label: "Get Item",
    description: "Get an Item by ID",
  },
  authorization,
  inputs: {
    endpointUrl: endpointUrlInput,
    itemId: itemIdInput,
  },
  perform: async ({ credential }, { endpointUrl, itemId }) => {
    const acmeErpClient = getAcmeErpClient(
      util.types.toString(endpointUrl),
      credential
    );
    const response = await acmeErpClient.get(`/items/${itemId}`);
    return { data: response.data };
  },
  examplePayload: {
    data: {
      id: 1,
      name: "Widgets",
      quantity: 20,
    },
  },
});

const deleteItem = action({
  display: {
    label: "Delete Item",
    description: "Delete an Item by ID",
  },
  authorization,
  inputs: {
    endpointUrl: endpointUrlInput,
    itemId: itemIdInput,
  },
  perform: async ({ credential }, { endpointUrl, itemId }) => {
    const acmeErpClient = getAcmeErpClient(
      util.types.toString(endpointUrl),
      credential
    );
    const response = await acmeErpClient.delete(`/items/${itemId}`);
    return { data: null };
  },
});

const addItem = action({
  display: {
    label: "Add Item",
    description: "Add an Item to Inventory",
  },
  authorization,
  // We can define some inputs inline if they're not reused:
  inputs: {
    endpointUrl: endpointUrlInput,
    name: input({ label: "Item Name", type: "string" }),
    quantity: input({ label: "Item Quantity", type: "string" }),
  },
  perform: async ({ credential }, { endpointUrl, name, quantity }) => {
    const acmeErpClient = getAcmeErpClient(
      util.types.toString(endpointUrl),
      credential
    );
    const response = await acmeErpClient.post("/items/", {
      name,
      quantity,
    });
    return { data: response.data };
  },
  // This API call returns the item object that was created:
  examplePayload: {
    data: {
      id: 1,
      name: "Widgets",
      quantity: 20,
    },
  },
});

export default { addItem, deleteItem, getItem, listAllItems };
