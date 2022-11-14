import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, attachmentId } from "../../inputs";

export const getAttachment = action({
  display: {
    label: "Get Attachments",
    description: "Get the information and metadata of an attachment",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/attachments/${params.attachmentId}`, {
      params: {
        opt_fields:
          "gid,resource_type,created_at,download_url,host,name,parent,view_url",
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    attachmentId,
  },
  examplePayload: {
    data: {
      data: {
        gid: "12345",
        resource_type: "attachment",
        name: "Screenshot.png",
        resource_subtype: "dropbox",
        created_at: "2012-02-22T02:06:58.147Z",
        download_url: "https://s3.amazonaws.com/assets/123/Screenshot.png",
        host: "dropbox",
        parent: {
          gid: "12345",
          resource_type: "task",
          name: "Bug Task",
          resource_subtype: "default_task",
        },
        permanent_url: "https://s3.amazonaws.com/assets/123/Screenshot.png",
        view_url: "https://www.dropbox.com/s/123/Screenshot.png",
      },
    },
  },
});
