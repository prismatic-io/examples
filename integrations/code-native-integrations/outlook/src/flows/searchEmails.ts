import { flow } from "@prismatic-io/spectral";
import { type SearchEmailsInput } from "../schemas/flows";
import { createGraphClient, extractAccessToken } from "../services/graphClient";

export const searchEmails = flow({
  name: "Search Emails",
  stableKey: "search-emails",
  description:
    "Search for emails using various filters like sender, subject, attachments, etc.",
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        query: {
          type: "string",
          description: "Search terms to find in emails",
        },
        from: { type: "string", description: "Sender email address" },
        subject: { type: "string", description: "Words in the subject line" },
        hasAttachments: {
          type: "boolean",
          description: "Only emails with attachments",
        },
        unreadOnly: { type: "boolean", description: "Only unread emails" },
        folder: {
          type: "string",
          description: "Folder to search in (inbox, sent, drafts, all)",
        },
        limit: { type: "number", description: "Maximum number of results" },
      },
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const connection = configVars["Microsoft Outlook Connection"];
    const accessToken = extractAccessToken(connection);

    const client = createGraphClient(accessToken);

    // Get input data from trigger payload
    const input = params.onTrigger.results.body.data as SearchEmailsInput;

    // Build the query filter
    const filters: string[] = [];

    if (input.from) {
      filters.push(`from/emailAddress/address eq '${input.from}'`);
    }

    if (input.subject) {
      filters.push(`contains(subject, '${input.subject}')`);
    }

    if (input.hasAttachments) {
      filters.push("hasAttachments eq true");
    }

    if (input.unreadOnly) {
      filters.push("isRead eq false");
    }

    // Build the folder path
    let folderPath = "/me/messages";
    if (input.folder && input.folder !== "all") {
      folderPath = `/me/mailFolders/${input.folder}/messages`;
    }

    try {
      // Build the request
      let request = client
        .api(folderPath)
        .top(input.limit || 10)
        .select(
          "id,subject,from,receivedDateTime,hasAttachments,isRead,bodyPreview",
        )
        .orderby("receivedDateTime desc");

      // Add filter if any
      if (filters.length > 0) {
        request = request.filter(filters.join(" and "));
      }

      // Add search query if provided
      if (input.query) {
        request = request.search(`"${input.query}"`);
      }

      const response = await request.get();

      return {
        data: {
          emails: response.value,
          count: response.value.length,
        },
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to search emails: ${error.message}`);
    }
  },
});

export default searchEmails;
