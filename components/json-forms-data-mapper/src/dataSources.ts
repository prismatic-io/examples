import axios from "axios";
import { dataSource, input, util } from "@prismatic-io/spectral";
import { createClient as createHttpClient } from "@prismatic-io/spectral/dist/clients/http";

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
        const { data } = await jiraClient.get<{ id: string; name: string }[]>(
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

    // Fetch some dummy Acme issue types
    const { data: acmeType } = await axios.get<{ name: string; id: number }[]>(
      "https://REPLACE-ME"
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
                oneOf: allIssueTypes.map((issueType) => ({
                  const: util.types.toString(issueType.id),
                  title: issueType.name,
                })),
              },
              to: {
                type: "label",
                string: "<>",
              },
              plutoraIssueType: {
                type: "number",
                oneOf: acmeType.map((issueType) => ({
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
        },
      ],
    };

    return { result: { schema, uiSchema, data: {} } };
  },
  inputs: {
    jiraConnection: input({
      label: "Connection",
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

        // And I guess try to stringify list values if the above fails
        return rawValue.map((val) => ({ projectId: util.types.toString(val) }));
      },
    }),
  },
  dataSourceType: "jsonForm",
});

export default { jiraExampleJsonForms };
