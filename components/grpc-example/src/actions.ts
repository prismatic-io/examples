import { action, input } from "@prismatic-io/spectral";
import { createClient } from "./client";

const myConnectionField = input({
  label: "Connection",
  type: "connection",
  required: true,
});

const nameInput = input({
  label: "Name",
  type: "string",
  comments: "Your name",
  required: true,
});

export const sayHello = action({
  display: {
    label: "Say Hello",
    description: "Say hello to the person of the given name",
  },
  perform: async (context, { connection, name }) => {
    const { client, requestMetadata } = createClient(
      connection,
      "HelloService"
    );
    const response = await new Promise((resolve, reject) => {
      (client as any).sayHello(
        { greeting: name },
        requestMetadata,
        (err: any, response: any) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        }
      );
    });
    client.close();
    return {
      data: response,
    };
  },
  inputs: {
    connection: myConnectionField,
    name: nameInput,
  },
});

export default { sayHello };
