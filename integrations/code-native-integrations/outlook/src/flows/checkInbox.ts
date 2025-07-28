import { flow } from "@prismatic-io/spectral";
import { type CheckInboxInput } from "../schemas/flows";
import { createGraphClient, extractAccessToken } from "../services/graphClient";

export const checkInbox = flow({
  name: "Check Inbox",
  stableKey: "check-inbox",
  description: "Check inbox for recent messages with optional filtering",
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        unreadOnly: {
          type: "boolean",
          description: "Only show unread messages",
        },
        limit: {
          type: "number",
          description: "Maximum number of messages to retrieve",
        },
        includeAttachments: {
          type: "boolean",
          description: "Include attachment details",
        },
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
    const input = params.onTrigger.results.body.data as CheckInboxInput;

    try {
      // Build the request
      let request = client
        .api("/me/mailFolders/inbox/messages")
        .top(input.limit || 20)
        .select(
          "id,subject,from,receivedDateTime,hasAttachments,isRead,bodyPreview",
        )
        .orderby("receivedDateTime desc");

      // Filter for unread only if specified
      if (input.unreadOnly) {
        request = request.filter("isRead eq false");
      }

      const response = await request.get();

      // Add attachment details if requested
      let messages = response.value;
      if (input.includeAttachments) {
        // For each message with attachments, fetch attachment details
        messages = await Promise.all(
          messages.map(
            async (message: { hasAttachments: boolean; id: string }) => {
              if (message.hasAttachments) {
                const attachments = await client
                  .api(`/me/messages/${message.id}/attachments`)
                  .select("id,name,contentType,size")
                  .get();
                return { ...message, attachments: attachments.value };
              }
              return message;
            },
          ),
        );
      }

      return {
        data: {
          messages: messages,
          count: messages.length,
        },
      };
    } catch (error) {
      throw new Error(`Failed to check inbox: ${(error as Error).message}`);
    }
  },
});

export default checkInbox;
