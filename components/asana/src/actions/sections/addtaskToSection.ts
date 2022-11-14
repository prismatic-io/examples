import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  sectionId,
  insertAfter,
  insertBefore,
  taskId,
} from "../../inputs";

export const addTaskToSection = action({
  display: {
    label: "Add Task To Section",
    description: "Add an existing task to the given section of a project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/sections/${params.sectionId}/addTask`,
      {
        data: {
          insert_after: params.insertAfter,
          insert_before: params.insertBefore,
          task: params.taskId,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    sectionId,
    taskId,
    insertAfter,
    insertBefore,
  },
  examplePayload: { data: { data: {} } },
});
