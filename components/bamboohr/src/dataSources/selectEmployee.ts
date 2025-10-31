import { dataSource, type Element } from "@prismatic-io/spectral";
import { createBambooClient } from "../client";
import { connectionInput } from "../inputs";
import { Employee } from "../interfaces/Employee";
import { BambooHRPayload } from "../interfaces/BambooHRPayload";

export const selectEmployee = dataSource({
  display: {
    label: "Select Employee",
    description: "Select an employee from a list of employees.",
  },
  inputs: {
    connection: connectionInput,
  },
  perform: async (context, { connection }) => {
    const client = createBambooClient(connection);
    const { data: { fields: employees } } = await client.get<BambooHRPayload<Employee>>("/v1/employees/directory");

    const result: Element[] = employees.map(({ name, id }) => ({
      label: name,
      key: id,
    }));

    return { result };
  },
  dataSourceType: "picklist",
});
