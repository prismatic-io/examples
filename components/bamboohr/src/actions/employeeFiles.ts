import { action, input, util } from "@prismatic-io/spectral";
import FormData from "form-data";
import { createBambooClient } from "../client";
import {
  categoryId,
  connectionInput,
  employeeId,
  file,
  fileId,
  fileName,
  share,
} from "../inputs";

const listEmployeeFiles = action({
  display: {
    label: "List Employee Files",
    description: "List all employee categories and files",
  },
  inputs: { connection: connectionInput, employeeId },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get(
      `/v1/employees/${params.employeeId}/files/view`
    );
    return { data };
  },
  examplePayload: {
    data: {
      employee: { id: 4 },
      categories: [
        {
          id: 12,
          name: "Signed Documents",
          canRenameCategory: "yes",
          canDeleteCategory: "yes",
          canUploadFiles: "yes",
          displayIfEmpty: "yes",
          files: [
            {
              id: 4,
              name: "Company Handbook.pdf",
              originalFileName: "Company Handbook.pdf",
              size: 2807480,
              dateCreated: "2022-07-04T20:45:51+0000",
              createdBy: "Charlotte Abbott",
              shareWithEmployee: "yes",
              canRenameFile: "yes",
              canDeleteFile: "yes",
              canChangeShareWithEmployeeFieldValue: "yes",
            },
            {
              id: 10,
              name: "I-9 (2017).pdf",
              originalFileName: "I-9 (2017).pdf",
              size: 2750869,
              dateCreated: "2022-07-04T21:25:11+0000",
              createdBy: "Charlotte Abbott",
              shareWithEmployee: "yes",
              canRenameFile: "yes",
              canDeleteFile: "yes",
              canChangeShareWithEmployeeFieldValue: "yes",
            },
          ],
        },
        {
          id: 10,
          name: "Workflow Attachments",
          canRenameCategory: "yes",
          canDeleteCategory: "yes",
          canUploadFiles: "yes",
          displayIfEmpty: "yes",
          files: [],
        },
      ],
    },
  },
});

const addEmployeeFileCategory = action({
  display: {
    label: "Create Employee File Category",
    description: "Create a new employee file category (folder)",
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
    const { data } = await client.post("/v1/employees/files/categories", [
      params.categoryName,
    ]);
    return { data };
  },
});

const deleteEmployeeFile = action({
  display: {
    label: "Delete Employee File",
    description: "Delete an employee file",
  },
  inputs: { connection: connectionInput, employeeId, fileId },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.delete(
      `/v1/employees/${params.employeeId}/files/${params.fileId}`
    );
    return { data };
  },
});

const getEmployeeFile = action({
  display: {
    label: "Get Employee File",
    description: "Get an employee file",
  },
  inputs: { connection: connectionInput, employeeId, fileId },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const {
      data,
      headers,
    } = await client.get(
      `/v1/employees/${params.employeeId}/files/${params.fileId}`,
      { responseType: "arraybuffer" }
    );
    return { data, contentType: headers["content-type"] };
  },
});

const uploadEmployeeFile = action({
  display: {
    label: "Upload Employee File",
    description: "Upload a new employee file",
  },
  inputs: {
    connection: connectionInput,
    employeeId,
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
    await client.post(
      `/v1/employees/${params.employeeId}/files`,
      formData.getBuffer(),
      { headers: formData.getHeaders() }
    );
    return { data: null };
  },
});

export default {
  addEmployeeFileCategory,
  deleteEmployeeFile,
  getEmployeeFile,
  listEmployeeFiles,
  uploadEmployeeFile,
};
