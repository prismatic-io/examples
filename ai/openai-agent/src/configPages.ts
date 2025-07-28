import {
  configPage,
  configVar,
  connectionConfigVar,
} from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "",
    elements: {
      OPENAI_API_KEY: connectionConfigVar({
        label: "OPENAI API Key",
        iconPath: "./assets/icon.png",
        stableKey: "a249ac69-48f2-4e99-84d0-abc234123123",
        dataType: "connection",
        inputs: {
          apiKey: {
            label: "API Key",
            placeholder: "sk-proj-Csg...",
            type: "string",
            required: true,
            shown: true,
            default: "",
          },
        },
      }),

    },
  }),
  Prompts: configPage({
    tagline: "",
    elements: {
      Header: "<h3>Setup Prompts</h3>",
      SYSTEM_PROMPT: configVar({
        stableKey: "1F886045-27E7-452B-9B44-776863F6A862",
        dataType: "string",
        description: "The agent's system prompt",
        defaultValue:
          "You are a helpful assistant. When users ask questions, use the webSearch tool to find accurate information. Never make assumptions or provide answers without verifying with search results. Never summarize tool use.",
      }),
    },
  }),
};
