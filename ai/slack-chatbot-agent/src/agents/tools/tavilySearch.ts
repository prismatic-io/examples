/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tool, tool } from "@openai/agents";
import { tavily as client } from "@tavily/core";
import { z } from "zod";

// Schema for Tavily search results
export const TavilyImageSchema = z.object({
  url: z.string(),
  description: z.string(),
});

export const TavilySearchResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  content: z.string(),
  rawContent: z.string(),
  score: z.number(),
  publishedDate: z.string(),
});

export const TavilySearchResponseSchema = z.object({
  answer: z.string(),
  query: z.string(),
  images: z.array(TavilyImageSchema),
  results: z.array(TavilySearchResultSchema),
});
export const tavily = (apiKey: string): { tavilySearchTool: Tool } => {
  const tvly = client({ apiKey });
  return {
    tavilySearchTool: tool({
      name: "tavily_search",
      description:
        "Search the web using Tavily search API to find current information",
      parameters: z.object({
        query: z.string().describe("The search query to execute"),
        maxResults: z
          .number()
          .optional()
          .default(5)
          .describe("Maximum number of results to return"),
      }),
      async execute({ query, maxResults }) {
        try {
          const response = await tvly.search(query, {
            max_results: maxResults,
          });
          console.log(
            "Search Results: ",
            JSON.stringify(response, undefined, 2),
          );
          return response;
        } catch (error) {
          return `Error performing search: ${error}`;
        }
      },
    }),
  };
};
