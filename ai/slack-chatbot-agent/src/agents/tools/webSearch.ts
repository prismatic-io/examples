/* eslint-disable @typescript-eslint/no-explicit-any */
import { Agent, handoff } from "@openai/agents";
import { tavily, TavilySearchResponseSchema } from "./tavilySearch";
import { z } from "zod";
import {
  QUERY_TRANSLATOR_PROMPT,
  RESPONSE_EXPERT_PROMPT,
  SEARCH_EXPERT_PROMPT,
} from "../prompts";

// Schema for Query Translator → Search Executor handoff
const QueryHandoffData = z.object({
  originalQuery: z.string(),
  optimizedQueries: z.array(z.string()),
});

// Schema for Search Executor → Summarizer handoff
const SearchResultsHandoffData = z.object({
  originalQuery: z.string(),
  searchResults: TavilySearchResponseSchema,
  queriesUsed: z.array(z.string()),
});

export function webSearchTeam(config?: SearchConfig) {
  // Agent that summarizes search results into a polished response (final agent in chain)
  if (!config?.TAVILY_API_KEY) {
    throw new Error(
      "TAVILY_API_KEY not provided, but required for websearch tool",
    );
  }
  const { tavilySearchTool } = tavily(config.TAVILY_API_KEY);
  const summarizerAgent = new Agent({
    name: "Summarizer",
    instructions: `${RESPONSE_EXPERT_PROMPT}`,
  });

  // Agent that executes searches and retrieves results
  const searchExecutorAgent = new Agent({
    name: "Search Executor",
    instructions: `${SEARCH_EXPERT_PROMPT}`,
    tools: [tavilySearchTool],
    handoffs: [
      handoff(summarizerAgent, {
        inputType: SearchResultsHandoffData,
        onHandoff: (ctx, input) => {
          console.log("🔄 HANDOFF: Search Executor → Summarizer");
          if (input) {
            console.log("  Queries used:", input.queriesUsed);
            console.log("  Search results: ", input.searchResults);
            console.log(
              "  Results count:",
              input.searchResults?.results?.length || 0,
            );
          }
        },
      }),
    ],
  });

  // Agent that translates user input into effective search queries
  const queryTranslatorAgent = new Agent({
    name: "Query Translator",
    instructions: `${QUERY_TRANSLATOR_PROMPT}`,
    handoffs: [
      handoff(searchExecutorAgent, {
        inputType: QueryHandoffData,
        onHandoff: (ctx, input) => {
          console.log("🔄 HANDOFF: Query Translator → Search Executor");
          if (input) {
            console.log("  Original query:", input.originalQuery);
            console.log("  Optimized queries:", input.optimizedQueries);
          }
        },
      }),
    ],
  });

  return queryTranslatorAgent;
}

interface SearchConfig {
  TAVILY_API_KEY?: string;
}
// Create the primary agent that can use web search as a tool
const webSearch = (config?: SearchConfig) => {
  return webSearchTeam(config).asTool({
    toolName: "webSearch",
    toolDescription:
      "A tool that optimizes queries, performs web searches, and synthesizes comprehensive answers from the results.",
  });
};

export default webSearch;
