import isEqual from "lodash.isequal";
import { action, input, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, directoryPath } from "../inputs";

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
    const dbx = await createAuthorizedClient(params.dropboxConnection);
    const cursorData = context.instanceState[context.stepId] as CursorData;

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
        data: response.result,
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
    recursive: input({
      label: "Recursive",
      comments:
        "If true, the response will contain contents of all subfolders.",
      type: "boolean",
      default: "false",
      required: true,
      clean: util.types.toBool,
    }),
    includeDeleted: input({
      label: "Include Deleted?",
      comments:
        "If true, the results will include entries for files and folders that used to exist but were deleted.",
      type: "boolean",
      default: "false",
      required: true,
      clean: util.types.toBool,
    }),
  },
  examplePayload: {
    data: {
      entries: [
        {
          ".tag": "deleted",
          name: "my-old-image.png",
          path_lower: "/my-old-image.png",
          path_display: "/my-old-image.png",
        },
        {
          ".tag": "file",
          name: "my-new-image.png",
          path_lower: "/my-new-image.png",
          path_display: "/my-new-image.png",
          id: "id:BTY6k_2K8PAAAAAAAAAX9g",
          client_modified: "2022-12-12T21:39:30Z",
          server_modified: "2022-12-12T22:40:57Z",
          rev: "5efa9326918a601c39731",
          size: 1758021,
          is_downloadable: true,
          content_hash:
            "dc05a61ecd59d294da1e971c4e40a980b9042c633b7bc777367991a046d2b32d",
        },
      ],
      cursor: "AAFCBKRdVxEXAMPLE",
      has_more: false,
    },
    instanceState: { "step-id": "AAFCBKRdVxEXAMPLE" },
  },
});
