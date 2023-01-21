import axios from "axios";
import { dataSource, input, util } from "@prismatic-io/spectral";
import { createClient as createHttpClient } from "@prismatic-io/spectral/dist/clients/http";

const acmeIssueTypeEndpoint =
  "https://raw.githubusercontent.com/prismatic-io/examples/main/components/json-forms-data-mapper/acme-issue-types.json";
type AcmeIssueType = { name: string; id: number };
type JiraIssueType = { name: string; id: string };

export const jiraExampleJsonForms = dataSource({
  display: {
    label: "Jira Example JSON Forms",
    description: "Example data mapping with JSON forms",
  },
  perform: async (context, params) => {
    // Connection information for Jira.
    // This assumes a Jira OAuth 2.0 connection.
    const jiraHeaders = {
      Authorization: `Bearer ${params.jiraConnection.token?.access_token}`,
    };
    // Fetch Jira Host ID to build user's Jira endpoint
    const {
      data: [{ id }],
    } = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      { headers: jiraHeaders }
    );
    // Create HTTP Client for Jira
    const jiraClient = createHttpClient({
      baseUrl: `https://api.atlassian.com/ex/jira/${id}/rest/api/3`,
      headers: jiraHeaders,
      responseType: "json",
    });

    // Fetch all issue types for each project
    const promises = params.jiraProjectIds.map(
      async ({ projectId, projectName }) => {
        const { data } = await jiraClient.get<JiraIssueType[]>(
          "/issuetype/project",
          {
            params: { projectId },
          }
        );
        return data.map((issueType) => ({
          ...issueType,
          projectName: projectName,
        }));
      }
    );

    // Flatten and sort data that came back
    const allIssueTypes = (await Promise.all(promises))
      .flatMap((v) => v)
      .sort((a, b) => (a.name < b.name ? -1 : 1));

    // Clean up the issue types. Append project name for project-specific issue types, and de-duplicate
    // issue types that are used in multiple projects
    const cleanedJiraIssueTypes: { const: string; title: string }[] = [];
    for (const issueType of allIssueTypes) {
      if (allIssueTypes.filter((i) => i.id === issueType.id).length > 1) {
        if (
          !cleanedJiraIssueTypes.filter((i) => i.const === issueType.id).length
        ) {
          cleanedJiraIssueTypes.push({
            title: issueType.name,
            const: issueType.id,
          });
        }
      } else {
        cleanedJiraIssueTypes.push({
          title:
            params.jiraProjectIds.length > 1 && issueType.projectName
              ? `${issueType.name} (${issueType.projectName})`
              : issueType.name,
          const: issueType.id,
        });
      }
    }

    // Fetch some dummy Acme issue types
    const { data: acmeIssueTypes } = await axios.get<AcmeIssueType[]>(
      acmeIssueTypeEndpoint,
      {
        headers: {
          "x-api-key": util.types.toString(params.acmeConnection.fields.apiKey),
        },
      }
    );

    const schema = {
      type: "object",
      properties: {
        mymappings: {
          // Arrays allow users to make one or more mappings
          type: "array",
          items: {
            // Each object in the array should contain a user and task
            type: "object",
            properties: {
              jiraIssueType: {
                type: "string",
                // Have users select "one of" a dropdown of items
                oneOf: cleanedJiraIssueTypes,
              },
              acmeIssueType: {
                type: "string",
                oneOf: acmeIssueTypes.map((issueType) => ({
                  const: util.types.toString(issueType.id),
                  title: issueType.name,
                })),
              },
            },
          },
        },
      },
    };

    const uiSchema = {
      type: "VerticalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/mymappings",
          label: "Jira <> Acme Issue Type Mappings",
        },
      ],
    };

    // Some default data to get pre-populate the map and get the user started
    const defaultValues = {
      mymappings: [
        {
          jiraIssueType: cleanedJiraIssueTypes[0].const,
          acmeIssueType: util.types.toString(acmeIssueTypes[0].id),
        },
      ],
    };

    return { result: { schema, uiSchema, data: defaultValues } };
  },
  inputs: {
    jiraConnection: input({
      label: "Jira Connection",
      type: "connection",
      required: true,
    }),
    acmeConnection: input({
      label: "Acme Connection",
      type: "connection",
      required: true,
    }),
    jiraProjectIds: input({
      label: "Project ID(s)",
      type: "string",
      required: true,
      example: "10201",
      comments: "Provide one or more Project IDs.",
      clean: (
        rawValue: unknown
      ): { projectId: string; projectName?: string }[] => {
        // These may be sourced from one of two data sources - one returns just project IDs, and one returns project IDs with names.

        // Try to handle scalar values
        if (!Array.isArray(rawValue)) {
          return [{ projectId: util.types.toString(rawValue) }];
        }

        // As well as object selections
        if (util.types.isObjectSelection(rawValue)) {
          return rawValue.map(({ object: { label, key } }) => ({
            projectId: key,
            projectName: label,
          }));
        }

        // Try to stringify list values if the above fails
        return rawValue.map((val) => ({ projectId: util.types.toString(val) }));
      },
    }),
  },
  dataSourceType: "jsonForm",
});

export default { jiraExampleJsonForms };
