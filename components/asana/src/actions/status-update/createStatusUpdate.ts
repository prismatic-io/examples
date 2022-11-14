import { action, input, util } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  limit,
  offset,
  statusParentIdInput,
} from "../../inputs";

export const createStatusUpdate = action({
  display: {
    label: "Create Status Update",
    description: "Create a status update from a project, portfolio, or goal",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/status_updates`,
      {
        data: {
          parent: params.parent,
          text: params.statusUpdateText,
          title: params.statusUpdateTitle,
          status_type: params.statusType,
        },
      },
      {
        params: {
          limit: params.limit,
          offset: params.offset,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    parent: statusParentIdInput,
    statusUpdateTitle: input({
      label: "Status Title",
      type: "string",
      comments: "The title of the project status update.",
      example: "Example Status Update - Jun 15",
      required: true,
      clean: util.types.toString,
    }),
    statusUpdateText: input({
      label: "Status Text",
      type: "string",
      comments: "The text content of the status update.",
      example: "The project is moving forward according to plan.",
      required: true,
      clean: util.types.toString,
    }),
    statusType: input({
      label: "This represents the current state of the object",
      type: "string",
      default: "on_track",
      required: true,
      model: [
        { label: "On Track", value: "on_track" },
        { label: "Off Track", value: "off_track" },
        { label: "At Risk", value: "at_risk" },
        { label: "On Hold", value: "on_hold" },
      ],
      clean: util.types.toString,
    }),
    limit,
    offset,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202466825616154",
        resource_type: "status_update",
        num_hearts: 0,
        num_likes: 0,
        title: "Example project is going well",
        created_at: "2022-06-17T19:09:58.169Z",
        modified_at: "2022-06-17T19:09:58.169Z",
        status_type: "on_track",
        text: "It'll be completed on time!",
        parent: {
          gid: "1202178854270532",
          resource_type: "project",
          name: "Example Project",
        },
        resource_subtype: "project_status_update",
        hearted: false,
        hearts: [],
        liked: false,
        likes: [],
        created_by: {
          gid: "1202178852626547",
          resource_type: "user",
          name: "Example User",
        },
        html_text: "<body>It'll be completed on time!</body>",
      },
    },
  },
});
