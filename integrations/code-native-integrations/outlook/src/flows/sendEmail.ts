import { flow } from "@prismatic-io/spectral";
import { type SendEmailInput } from "../schemas/flows";
import { createGraphClient, extractAccessToken } from "../services/graphClient";

export const sendEmail = flow({
  name: "Send Email",
  stableKey: "send-email",
  description: "Send an email to one or more recipients with optional CC/BCC",
  isSynchronous: true,
  schemas: {
    invoke: {
      type: "object",
      properties: {
        to: {
          type: "array",
          description: "Recipient email addresses",
          items: { type: "string", format: "email" },
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        body: {
          type: "string",
          description: "Email message content",
        },
        cc: {
          type: "array",
          description: "CC recipients",
          items: { type: "string", format: "email" },
        },
        bcc: {
          type: "array",
          description: "BCC recipients",
          items: { type: "string", format: "email" },
        },
        isHtml: {
          type: "boolean",
          description: "Send as HTML email",
        },
        importance: {
          type: "string",
          description: "Email importance level (low, normal, high)",
          enum: ["low", "normal", "high"],
        },
      },
      required: ["to", "subject", "body"],
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const connection = configVars["Microsoft Outlook Connection"];
    const accessToken = extractAccessToken(connection);

    const client = createGraphClient(accessToken);

    // Get input data from trigger payload
    const input = params.onTrigger.results.body.data as SendEmailInput;

    // Build the message object
    const message: any = {
      subject: input.subject,
      body: {
        contentType: input.isHtml !== false ? "HTML" : "Text",
        content: input.body,
      },
      toRecipients: input.to.map((email: string) => ({
        emailAddress: { address: email },
      })),
      importance: input.importance || "normal",
    };

    // Add CC recipients if provided
    if (input.cc && input.cc.length > 0) {
      message.ccRecipients = input.cc.map((email: string) => ({
        emailAddress: { address: email },
      }));
    }

    // Add BCC recipients if provided
    if (input.bcc && input.bcc.length > 0) {
      message.bccRecipients = input.bcc.map((email: string) => ({
        emailAddress: { address: email },
      }));
    }

    try {
      // Send the email
      await client.api("/me/sendMail").post({
        message: message,
        saveToSentItems: true,
      });

      return {
        data: {
          success: true,
          message: "Email sent successfully",
        },
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to send email: ${error.message}`);
    }
  },
});

export default sendEmail;
