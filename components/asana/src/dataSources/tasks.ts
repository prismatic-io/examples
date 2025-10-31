import { dataSource } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput, workspaceId, projectId, assigneeId } from "../inputs";
import { cleanString, fetchMoreData, mapToLabelKey } from "../util";
import type { DataSource } from "../types/Project";

const selectTask = dataSource({
  display: {
    label: "Select Task",
    description: "Select a task from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
    project: {
      ...projectId,
      required: false,
      clean: cleanString,
      dataSource: undefined,
    },
    workspace: {
      ...workspaceId,
      required: false,
      clean: cleanString,
      dataSource: undefined,
      comments: `${workspaceId.comments} Workspace ID must be provided with an Assignee ID.`,
    },

    assignee: {
      ...assigneeId,
      comments: `${assigneeId.comments} Assignee ID must be provided with a Workspace ID.`,
    },
  },
  perform: async (_context, { connection, workspace, project, assignee }) => {
    const client = await createAsanaClient(connection, false);

    if (!workspace && !assignee && !project) {
      throw new Error(
        "Project ID or Workspace ID and Assignee ID must be provided",
      );
    }

    if ((assignee && !workspace) || (!assignee && workspace)) {
      throw new Error("Assignee ID and Workspace ID must be provided together");
    }

    if (assignee && project) {
      throw new Error("Assignee ID cannot be provided with a Project ID");
    }

    if (project && workspace) {
      throw new Error("Project ID cannot be provided with a Workspace ID");
    }

    const data = await fetchMoreData<DataSource>(client, "/tasks", [], true, {
      workspace,
      project,
      assignee,
    });

    const result = mapToLabelKey(data);

    return { result };
  },
  dataSourceType: "picklist",
});

export default {
  selectTask,
};
