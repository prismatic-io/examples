import { flow } from "@prismatic-io/spectral";
import zod from "zod";
import { createAcmeClient } from "./client";

interface AcmePeople {
  id: number;
  name: string;
  username: string;
  email: string;
}

const PeopleQuerySchema = zod.object({
  first: zod.string().optional(),
  last: zod.string().optional(),
});

export const searchPeople = flow({
  name: "Search People",
  stableKey: "search-people",
  description: "Search for People in Acme CRM",
  // Ensure that this flow is available to be used by an AI agent
  isAgentFlow: true,
  // Ensure this flow is run synchronously, so the AI agent can get the response immediately
  isSynchronous: true,
  schemas: {
    // Describe to an AI agent how to use this flow as an MCP tool
    invoke: {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $comment:
        "Given a first and last name of a person, search for matching people in Acme CRM",
      properties: {
        first: {
          description: "A person's first name",
          type: "string",
        },
        last: {
          description: "A person's last name",
          type: "string",
        },
      },
      title: "search-people-in-acme",
      type: "object",
    },
  },
  onExecution: async (context, params) => {
    const acmeClient = createAcmeClient(context.configVars["Acme Connection"]);

    const response = await acmeClient.get<AcmePeople[]>("/users");

    // Validate and extract the search parameters
    const { first: firstNameSearch, last: lastNameSearch } =
      PeopleQuerySchema.parse(params.onTrigger.results.body.data);

    // Filter the people based on the search parameters
    const matchingPeople = response.data.filter((person) => {
      const [firstName, lastName] = person.name.split(" ");
      if (firstNameSearch) {
        if (!firstName.toLowerCase().includes(firstNameSearch.toLowerCase())) {
          return false;
        }
      }
      if (lastNameSearch) {
        if (!lastName.toLowerCase().includes(lastNameSearch.toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    return { data: matchingPeople };
  },
});

export default [searchPeople];
