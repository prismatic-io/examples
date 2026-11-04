import { util, type Connection } from "@prismatic-io/spectral";
import { Client } from "pg";

export async function createPostgresClient(connection: Connection) {
  const { host, port, database, username, password } = connection.fields;
  const client = new Client({
    host: util.types.toString(host),
    port: util.types.toNumber(port),
    database: util.types.toString(database),
    user: util.types.toString(username),
    password: util.types.toString(password),
  });
  await client.connect();
  return client;
}
