import { Connection } from "@prismatic-io/spectral";
import format from "pg-format";
import { createPgClient } from "../pgClient";
import type { StandardizedLeadArray } from "./types";

export const createImportedLeadsTable = async (
  postgresConnection: Connection,
) => {
  const client = await createPgClient(postgresConnection);
  try {
    // Called once at the start of each backfill (see `onDeploy` in flows.ts), so
    // every fresh deploy drops any prior table and starts the sync from a clean
    // slate. Remove the DROP if you instead want to preserve existing rows.
    await client.query("DROP TABLE IF EXISTS imported_leads");
    await client.query(`
          CREATE TABLE imported_leads (
            id SERIAL PRIMARY KEY,
            external_id TEXT,
            name TEXT,
            email_address TEXT,
            phone TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          )`);
  } finally {
    await client.end();
  }
};

export const insertLeadsIntoDatabase = async (
  leads: StandardizedLeadArray,
  postgresConnection: Connection,
) => {
  const client = await createPgClient(postgresConnection);
  try {
    // Insert every lead in this batch with a single statement. `pg-format`'s
    // `%L` expands the array-of-arrays into a properly escaped VALUES list, e.g.
    // `VALUES ('id1','a',...), ('id2','b',...)`. Batch sizing is controlled by
    // the flow's `batchConfig`, so this receives one batch at a time.
    const leadsToInsert = leads.map((sfdcLead) => [
      sfdcLead.sfdcId,
      sfdcLead.name,
      sfdcLead.email,
      sfdcLead.phone,
    ]);
    await client.query(
      format(
        "INSERT INTO imported_leads (external_id, name, email_address, phone) VALUES %L",
        leadsToInsert,
      ),
    );
  } finally {
    await client.end();
  }
};
