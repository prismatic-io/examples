import { action, input, util } from "@prismatic-io/spectral";
import FormData from "form-data";
import { createAsanaClient } from "../../client";
import { connectionInput, taskId } from "../../inputs";

export const attachFileToTask = action({
  display: {
    label: "Attach File to Task",
    description: "Attach a file to a task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const formData = new FormData();
    formData.append("file", params.file.data, { filename: params.fileName });
    const { data } = await client.post(
      `/tasks/${params.taskId}/attachments/`,
      formData,
      { headers: formData.getHeaders() }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    file: input({
      label: "File",
      comments: "File to attach. This should be a reference to a previous step",
      type: "data",
      required: true,
      clean: util.types.toBufferDataPayload,
    }),
    fileName: input({
      label: "File Name",
      comments: "Name of the file to attach",
      type: "string",
      required: true,
      example: "my-image.png",
      clean: util.types.toString,
    }),
    taskId,
  },
  examplePayload: {
    data: {
      data: {
        gid: "12345",
        resource_type: "attachment",
        name: "Screenshot.png",
        resource_subtype: "asana",
      },
    },
  },
});
