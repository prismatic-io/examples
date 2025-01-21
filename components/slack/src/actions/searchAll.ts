import { action } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import {
  connectionInput,
  debug,
  highlight,
  limit,
  page,
  query,
  sortSearch,
  sort_dir,
  team_id,
} from "../inputs";
import { searchAllResponse } from "../examplePayloads";
import { debugLogger } from "../utils";

export const searchAll = action({
  display: {
    label: "Search All",
    description: "Searches for messages and files matching a query.",
  },
  perform: async (
    context,
    {
      connection,
      debug,
      query,
      sort,
      sort_dir,
      count,
      team_id,
      highlight,
      page,
    },
  ) => {
    debugLogger({
      debug,
      query,
      sort,
      sort_dir,
      count,
      team_id,
      highlight,
      page,
    });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.search.all({
      query,
      sort,
      sort_dir,
      count,
      team_id,
      highlight,
      page,
    });
    return { data };
  },
  inputs: {
    query,
    count: {
      ...limit,
      label: "Count",
      comments: "Number of items to return per page.",
    },
    sort: sortSearch,
    sort_dir,
    page,
    highlight,
    team_id,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: searchAllResponse as unknown,
  },
});
