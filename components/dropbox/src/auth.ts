import fetch from "cross-fetch";
import { Dropbox } from "dropbox";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { getUserTypeHeader } from "./util";

export const createAuthorizedClient = (
  dropboxConnection: Connection,
  userType?: "admin" | "user",
  teamMemberId?: string
): Dropbox => {
  const client = new Dropbox({
    accessToken: util.types.toString(dropboxConnection.token.access_token),
    fetch,
    customHeaders:
      userType && teamMemberId ? getUserTypeHeader(userType, teamMemberId) : {},
  });

  return client;
};
