import { Connection, util } from "@prismatic-io/spectral";
import { Client as PostgresClient } from "pg";

export const getPostgresClient = async (connection: Connection) => {
  const client = new PostgresClient({
    user: util.types.toString(connection.fields.user),
    password: util.types.toString(connection.fields.password),
    host: util.types.toString(connection.fields.host),
    port: util.types.toNumber(connection.fields.port),
    database: util.types.toString(connection.fields.database),
  });
  await client.connect();
  return client;
};
