import { action, input } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  limit,
  offset,
  statusParentIdInput,
} from "../../inputs";

export const getStatusesForObject = action({
  display: {
    label: "Get Status Updates from Object",
    description: "Get status updates from a project, portfolio, or goal",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/status_updates`, {
      params: {
        parent: params.parent,
        limit: params.limit,
        offset: params.offset,
        opt_fields:
          "gid,resource_type,resource_subtype,title,text,status_type,parent,created_at",
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    parent: statusParentIdInput,
    limit,
    offset,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1202466843571433",
          created_at: "2022-06-17T19:22:53.380Z",
          resource_type: "status_update",
          resource_subtype: "project_status_update",
          status_type: "at_risk",
          text: "We accidentally force-pushed over our repo!",
          title: "It's going terribly!",
          parent: {
            gid: "1202178854270532",
            resource_type: "project",
          },
        },
        {
          gid: "1202466947841625",
          created_at: "2022-06-17T19:17:33.744Z",
          resource_type: "status_update",
          resource_subtype: "project_status_update",
          status_type: "on_track",
          text: "It'll be completed on time!",
          title: "Example project is going well",
          parent: {
            gid: "1202178854270532",
            resource_type: "project",
          },
        },
      ],
    },
  },
});
