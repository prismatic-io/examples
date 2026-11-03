import { Connection, util } from "@prismatic-io/spectral";
import { Client } from "pg";

export const createPgClient = async (connection: Connection) => {
  const { username, password, host, port, database } = connection.fields;
  const client = new Client({
    user: util.types.toString(username),
    password: util.types.toString(password),
    host: util.types.toString(host),
    port: util.types.toNumber(port),
    database: util.types.toString(database),
  });
  await client.connect();
  return client;
};
