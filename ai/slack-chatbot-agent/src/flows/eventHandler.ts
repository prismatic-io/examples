import { flow, util } from "@prismatic-io/spectral";
import { ack } from "../slack/acknowledge";
import { App } from "../slack/app";
import { createAssistant } from "../slack/assistant";

export const eventHandler = flow({
  name: "Slack Message Handler",
  stableKey: "slack-event-handler",
  description:
    "Handles Slack Events and generates responses with OpenAI Assistant SDK",
  onTrigger: async (context, payload) => {
    const connection = context.configVars["Slack Connection"];
    const signingSecret = util.types.toString(connection.fields.signingSecret);

    const response = ack(payload, signingSecret);

    // Ack immediately returned to Slack
    return Promise.resolve({
      payload,
      response,
    });
  },
  onExecution: async ({ configVars, customer }, params) => {
    const connection = configVars["Slack Connection"];
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );
    const tavilyConnection = util.types.toString(
      configVars.TAVILY_API_KEY.fields.apiKey,
    );
    const prismaticSigningKey = util.types.toString(
      configVars.PRISMATIC_SIGNING_KEY,
    );

    const assistant = await createAssistant({
      agent: {
        systemPrompt: configVars.SYSTEM_PROMPT,
        openAIKey: openaiConnection,
        // Used for websearch tool
        tavilyKey: tavilyConnection,
        prismaticSigningKey,
        // Used for providing enabled integrations as tools for agent
        customerProfile: {
          ...customer,
        },
      },
    });

    const app = App(connection, { assistant });
    const handler = await app.start();
    const result = await handler(params.onTrigger.results);

    return {
      data: result,
    };
  },
});

export default eventHandler;
