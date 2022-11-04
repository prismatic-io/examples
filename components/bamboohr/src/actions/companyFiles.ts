import { action, input, util } from "@prismatic-io/spectral";
import FormData from "form-data";
import { createBambooClient } from "../client";
import {
  categoryId,
  connectionInput,
  file,
  fileId,
  fileName,
  share,
} from "../inputs";

const listCompanyFiles = action({
  display: {
    label: "List Company Files",
    description: "List all company categories and files",
  },
  inputs: { connection: connectionInput },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get("/v1/files/view");
    return { data };
  },
  examplePayload: {
    data: {
      categories: [
        {
          id: 179,
          canUploadFiles: "yes",
          name: "BambooHR",
          files: [
            {
              id: 220,
              name: "4 Ways the BambooHR ATS Improves the Hiring Process",
              originalFileName:
                "4 Ways the BambooHR ATS Improves the Hiring Process.pdf",
              size: "855128",
              dateCreated: "2022-10-22T22:30:07+0000",
              createdBy: "Prismatic Developer",
              shareWithEmployees: "no",
              canRenameFile: "yes",
              canDeleteFile: "yes",
            },
            {
              id: 223,
              name: "5 Payroll Pain Points Solved by TRAXPayroll",
              originalFileName: "5 Payroll Pain Points.pdf",
              size: "523971",
              dateCreated: "2022-10-22T22:50:24+0000",
              createdBy: "Prismatic Developer",
              shareWithEmployees: "no",
              canRenameFile: "yes",
              canDeleteFile: "yes",
            },
          ],
        },
        {
          id: 175,
          canUploadFiles: "yes",
          name: "New Hire Forms",
          files: [
            {
              id: 164,
              name: "Australia Standard Choice Form.pdf",
              originalFileName: "Australia Standard Choice Form.pdf",
              size: "323487",
              dateCreated: "2022-07-01T15:15:33+0000",
              createdBy: null,
              shareWithEmployees: "no",
              canRenameFile: "yes",
              canDeleteFile: "yes",
            },
          ],
        },
      ],
    },
  },
});

const addCompanyFileCategory = action({
  display: {
    label: "Create Company File Category",
    description: "Create a new company file category (folder)",
  },
  inputs: {
    connection: connectionInput,
    categoryName: input({
      label: "Category Name",
      type: "string",
      required: true,
      clean: util.types.toString,
      example: "A new category",
    }),
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.post("/v1/files/categories", [
      params.categoryName,
    ]);
    return { data };
  },
});

const deleteCompanyFile = action({
  display: {
    label: "Delete Company File",
    description: "Delete an company file",
  },
  inputs: { connection: connectionInput, fileId },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.delete(`/v1/files/${params.fileId}`);
    return { data };
  },
});

const getCompanyFile = action({
  display: {
    label: "Get Company File",
    description: "Get an company file",
  },
  inputs: { connection: connectionInput, fileId },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data, headers } = await client.get(`/v1/files/${params.fileId}`, {
      responseType: "arraybuffer",
    });
    return { data, contentType: headers["content-type"] };
  },
});

const uploadCompanyFile = action({
  display: {
    label: "Upload Company File",
    description: "Upload a new company file",
  },
  inputs: {
    connection: connectionInput,
    categoryId,
    fileName,
    share,
    file,
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const formData = new FormData();
    formData.append("category", params.categoryId);
    formData.append("fileName", params.fileName);
    formData.append("share", params.share);
    formData.append("file", params.file.data, params.fileName);
    await client.post(`/v1/files`, formData.getBuffer(), {
      headers: formData.getHeaders(),
    });
    return { data: null };
  },
});

export default {
  addCompanyFileCategory,
  deleteCompanyFile,
  getCompanyFile,
  listCompanyFiles,
  uploadCompanyFile,
};
