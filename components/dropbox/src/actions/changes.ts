import isEqual from "lodash.isequal";
import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  debug,
  directoryPath,
  includeDeleted,
  recursive,
  teamMemberId,
  userType,
} from "../inputs";
import { checkDebug } from "../util";
import { listChangesPayload } from "../example-payloads";

interface CursorData {
  cursor: string;
  path: string;
  recursive: boolean;
  includeDeleted: boolean;
}

export const listChanges = action({
  display: {
    label: "List Changes",
    description:
      "List changes that have been made to files in this folder since the last time this action was run.",
  },
  perform: async (context, params) => {
    const dbx = createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );
    const cursorData = context.instanceState[context.stepId] as CursorData;

    checkDebug(params, context);

    if (
      cursorData &&
      isEqual(
        {
          path: cursorData.path,
          recursive: cursorData.recursive,
          includeDeleted: cursorData.includeDeleted,
        },
        {
          path: params.directoryPath,
          recursive: params.recursive,
          includeDeleted: params.includeDeleted,
        }
      )
    ) {
      // We have previously run with these settings and will only show changes since the last run
      const response = await dbx.filesListFolderContinue({
        cursor: cursorData.cursor,
      });
      const newCursorData: CursorData = {
        cursor: response.result.cursor,
        path: params.directoryPath,
        recursive: params.recursive,
        includeDeleted: params.includeDeleted,
      };
      return {
        data: response.result as any,
        instanceState: { [context.stepId]: newCursorData },
      };
    } else {
      // We have not previously run or settings have changed.
      // Return the current cursor for this folder
      const response = await dbx.filesListFolderGetLatestCursor({
        path: params.directoryPath,
        recursive: params.recursive,
        include_deleted: params.includeDeleted,
        limit: 2000,
      });
      context.logger.info(
        "First time running, or settings have changed. Subsequent runs will show changes that occurred since the previous run."
      );
      const newCursorData: CursorData = {
        cursor: response.result.cursor,
        path: params.directoryPath,
        recursive: params.recursive,
        includeDeleted: params.includeDeleted,
      };
      return {
        data: {
          entries: [],
          cursor: response.result.cursor,
          has_more: false,
        },
        instanceState: { [context.stepId]: newCursorData },
      };
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    directoryPath,
    recursive,
    includeDeleted,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: listChangesPayload,
    instanceState: {},
  },
});
