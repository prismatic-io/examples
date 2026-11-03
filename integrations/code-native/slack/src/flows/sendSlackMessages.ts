/** 
 * This flow receives an XML payload and sends a message to a Slack channel.
 * The trigger in this flow is responsible for deserializing the XML payload
 * and returning an acknowledgement message before the execution function is
 * called.
 * 
 * This is an example payload that the trigger should receive:
 
  <notification>
    <type>new_account</type>
    <challenge>067DEAB4-B89C-4211-9767-84C96A39CF8C</challenge>
    <account>
      <first>Nelson</first>
      <last>Bighetti</last>
      <company>
        <name>Hooli</name>
        <city>Palo Alto</city>
        <state>CA</state>
      </company>
    </account>
  </notification>
 *
 */

import { HttpResponse, flow, util } from "@prismatic-io/spectral";
import { XMLParser } from "fast-xml-parser";
import { createSlackClient } from "../slackClient";

interface AccountNotification {
  notification: {
    type: string;
    challenge: string;
    account: {
      first: string;
      last: string;
      company: {
        name: string;
        city: string;
        state: string;
      };
    };
  };
}

const sendMessagesFlow = flow({
  name: "Send Slack Message on Account Received",
  stableKey: "send-slack-messages",
  description: "Send a message to a Slack channel when an account is received",
  onTrigger: async (context, payload) => {
    // Parse the raw XML from the webhook request
    const parser = new XMLParser();
    const parsedBody = parser.parse(util.types.toString(payload.rawBody.data));

    // Respond to the request with a plaintext response that includes the challenge key
    const response: HttpResponse = {
      statusCode: 200,
      contentType: "text/plain",
      body: parsedBody.notification.challenge,
    };

    // Ensure that the payload is updated with the parsed body
    return Promise.resolve({
      payload: { ...payload, body: { data: parsedBody } },
      response,
    });
  },
  onExecution: async (context, params) => {
    const { configVars } = context;
    const slackClient = createSlackClient(configVars["Slack Connection"]);

    // The parsed XML payload is available in the params object
    const data = params.onTrigger.results.body.data as AccountNotification;

    // Construct a message to send to Slack
    const message =
      `New account received:\n` +
      `Name: ${data.notification.account.first} ${data.notification.account.last}\n` +
      `Company: ${data.notification.account.company.name}\n` +
      `Location: ${data.notification.account.company.city}, ${data.notification.account.company.state}\n`;

    await slackClient.post("chat.postMessage", {
      channel: configVars["Select Slack Channel"],
      text: message,
    });

    return { data: null };
  },
});

export default sendMessagesFlow;
