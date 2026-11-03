import {
  type Connection,
  type Element,
  configPage,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";
import { createPostgresClient } from "./postgresClient";

export const configPages = {
  Connections: configPage({
    elements: {
      "Postgres Connection": connectionConfigVar({
        stableKey: "postgres-connection",
        dataType: "connection",
        inputs: {
          host: {
            label: "Host",
            placeholder: "Host",
            type: "string",
            required: true,
            shown: true,
            comments: "Provide the string value for the host of the server.",
            example: "192.168.0.1",
          },
          port: {
            label: "Port",
            placeholder: "Port",
            type: "string",
            default: "5432",
            required: true,
            shown: true,
            comments: "The port of the PostgreSQL server.",
          },
          database: {
            label: "Database",
            placeholder: "Database",
            type: "string",
            required: true,
            shown: true,
            comments: "The database in PostgreSQL",
            example: "admin",
          },
          username: {
            label: "Username",
            placeholder: "Username",
            type: "string",
            required: false,
            shown: true,
          },
          password: {
            label: "Password",
            placeholder: "Password",
            type: "password",
            required: false,
            shown: true,
          },
        },
      }),
    },
  }),
  "PostgreSQL Configuration": configPage({
    elements: {
      "Select Table": dataSourceConfigVar({
        stableKey: "select-table",
        dataSourceType: "picklist",
        description: "Select a table from the connected Postgres database.",
        perform: async (context) => {
          const postgresClient = await createPostgresClient(
            context.configVars["Postgres Connection"] as Connection
          );
          const result = await postgresClient.query<{
            table_schema: string;
            table_name: string;
          }>(
            [
              "SELECT table_schema, table_name",
              "FROM information_schema.tables",
              "WHERE table_type = 'BASE TABLE'",
              "AND table_schema NOT IN ('pg_catalog', 'information_schema')",
              "ORDER BY table_schema, table_name",
            ].join("\n")
          );
          const options: Element[] = result.rows.map((row) => ({
            key: `${row.table_schema}.${row.table_name}`,
            label: `${row.table_schema}.${row.table_name}`,
          }));
          return { result: options };
        },
      }),
    },
  }),
};
