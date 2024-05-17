export type Sort = "relevant" | "name" | "member_count" | "created";
export type SortDir = "desc" | "asc";
type search_channel_types =
  | "private"
  | "private_exclude"
  | "archived"
  | "exclude_archived"
  | "private_exclude_archived"
  | "multi_workspace"
  | "org_wide"
  | "external_shared_exclude"
  | "external_shared"
  | "external_shared_private"
  | "external_shared_archived"
  | "exclude_org_shared";

export type SearchChannelType = search_channel_types[];

export type SearchAllSort = "timestamp" | "score";
