import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  limit,
  offset,
  connectionInput,
  taskId,
  listAllNestedSubtasks,
} from "../../inputs";
import { optionalFields } from "../../constants";
import { getSubtasks } from "../../helpers";
import { Task } from "../../types/Task";

export const listSubtasks = action({
  display: {
    label: "List Subtasks",
    description: "Return a list of all subtasks in a given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);

    // Get the first page of subtasks
    let subtasks = await getSubtasks(client, params.taskId, {
      limit: params.limit,
      offset: params.offset,
      opt_fields: optionalFields,
    });

    // If the user wants to list all nested subtasks, we need to get all subtasks
    if (params.listAllNestedSubtasks) {
      // Create a copy of the subtasks array to store all subtasks
      const allSubtasks = [...subtasks];

      // If there are subtasks, we possibly need to get more subtasks
      let shouldGetMoreSubtasks = subtasks.length;

      while (shouldGetMoreSubtasks) {
        const toGetSubtasks = subtasks.reduce(
          (getSubtasksAccumulator: Promise<Task[]>[], subtask) => {
            // If the subtask has subtasks, we need to get them
            if (subtask.num_subtasks > 0) {
              getSubtasksAccumulator.push(
                getSubtasks(client, subtask.gid, {
                  opt_fields: optionalFields,
                })
              );
            }
            return getSubtasksAccumulator;
          },
          []
        );

        // Retrieve all subtasks parallelly
        const results: Task[][] = await Promise.all(toGetSubtasks);

        // Reset the subtasks array to store the subtasks of the current iteration
        subtasks = [];

        results.forEach((result) =>
          result.forEach((subtask: Task) => {
            // Push the subtask to the subtasks array
            subtasks.push(subtask);
            // Push the subtask to the allSubtasks array
            allSubtasks.push(subtask);
          })
        );

        // If there are no subtasks, we don't need to get more subtasks
        shouldGetMoreSubtasks = subtasks.length;
      }
      return { data: { data: allSubtasks } };
    } else return { data: { data: subtasks } };
  },
  inputs: {
    asanaConnection: connectionInput,
    taskId,
    limit,
    offset,
    listAllNestedSubtasks,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1234567890123456",
          assignee: null,
          assignee_status: "upcoming",
          completed: false,
          completed_at: null,
          created_at: "2023-11-10T00:29:54.363Z",
          custom_fields: [],
          dependencies: [],
          dependents: [],
          due_at: null,
          due_on: null,
          followers: [
            {
              gid: "7890123456789012",
              resource_type: "user",
            },
          ],
          html_notes: "<body></body>",
          is_rendered_as_separator: false,
          liked: false,
          likes: [],
          memberships: [],
          modified_at: "2023-11-10T00:31:18.774Z",
          name: "Task",
          notes: "",
          num_likes: 0,
          num_subtasks: 2,
          parent: {
            gid: "2345678901234567",
            resource_type: "task",
          },
          projects: [],
          resource_type: "task",
          start_on: null,
          tags: [],
          resource_subtype: "default_task",
          workspace: {
            gid: "8901234567890123",
            resource_type: "workspace",
          },
        },
      ],
    },
  },
});
