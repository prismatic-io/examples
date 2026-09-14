import { flow } from "@prismatic-io/spectral";
import z from "zod";
import { getPostgresClient } from "./postgresClient";

const lead = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  company: z.string(),
});

export const listItems = flow({
  name: "Process Leads",
  stableKey: "process-leads",
  description: "Process external leads and send them to Acme",
  onExecution: async (context, params) => {
    const payload = lead.parse(params.onTrigger.results.body.data);
    try {
      const pgClient = await getPostgresClient(
        context.configVars["Postgres Connection"],
      );
      await pgClient.query(
        `INSERT INTO leads (first_name, last_name, company, phone_number, email, external_id)
          VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          payload.firstName,
          payload.lastName,
          payload.company,
          payload.phone,
          payload.email,
          payload.id,
        ],
      );
      // Simulate some work by sleeping between 1 and 5 seconds
      await new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * 5000) + 1000),
      );
    } catch (err) {
      context.logger.error(`Failed to process lead: ${err}`);
      throw err;
    }
  },
});

export default [listItems];
