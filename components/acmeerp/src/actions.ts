import { action, input } from "@prismatic-io/spectral";
import { getAcmeErpClient } from "./auth";
import { connectionInput, itemIdInput } from "./inputs";

/* List all items in inventory */
const listAllItems = action({
  display: {
    label: "List All Items",
    description: "List all items in our inventory",
  },
  inputs: {
    // Declare an input for this action
    acmeConnection: connectionInput,
  },
  perform: async (context, { acmeConnection }) => {
    // Initialize our HTTP client
    const acmeErpClient = getAcmeErpClient(acmeConnection);

    // Make a synchronous GET call to "{ endpoint }/items":
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

/* Get a specific item from inventory by ID */
const getItem = action({
  display: {
    label: "Get Item",
    description: "Get an Item by ID",
  },
  inputs: {
    acmeConnection: connectionInput,
    itemId: itemIdInput,
  },
  perform: async (context, { acmeConnection, itemId }) => {
    const acmeErpClient = getAcmeErpClient(acmeConnection);
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

/* Delete an item from inventory by ID */
const deleteItem = action({
  display: {
    label: "Delete Item",
    description: "Delete an Item by ID",
  },
  inputs: {
    acmeConnection: connectionInput,
    itemId: itemIdInput,
  },
  perform: async (context, { acmeConnection, itemId }) => {
    const acmeErpClient = getAcmeErpClient(acmeConnection);
    const response = await acmeErpClient.delete(`/items/${itemId}`);
    return { data: null };
  },
});

/* Add a new item to inventory */
const addItem = action({
  display: {
    label: "Add Item",
    description: "Add an Item to Inventory",
  },
  // We can define some inputs inline if they're not reused:
  inputs: {
    acmeConnection: connectionInput,
    name: input({ label: "Item Name", type: "string" }),
    quantity: input({ label: "Item Quantity", type: "string" }),
  },
  perform: async (context, { acmeConnection, name, quantity }) => {
    const acmeErpClient = getAcmeErpClient(acmeConnection);
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
