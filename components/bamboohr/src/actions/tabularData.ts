import { action, connection } from "@prismatic-io/spectral";
import { createBambooClient } from "../client";
import {
  connectionInput,
  employeeId,
  rowId,
  tableFieldValues,
  tableName,
} from "../inputs";

// Wraps https://documentation.bamboohr.com/reference/get-employee-table-row-1
const getEmployeeTable = action({
  display: {
    label: "Get an Employee's Table",
    description: "Get a specific table associated with an employee",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get(
      `/v1/employees/${params.employeeId}/tables/${params.tableName}`
    );
    return { data };
  },
  inputs: { connection: connectionInput, employeeId, tableName },
});

// Wraps https://documentation.bamboohr.com/reference/metadata-get-a-list-of-tabular-fields-1
const getTabularFields = action({
  display: {
    label: "List Tabular Fields (Tables)",
    description: "List all tables and their fields in the account",
  },
  inputs: { connection: connectionInput },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get("/v1/meta/tables");
    return { data };
  },
  examplePayload: {
    data: [
      {
        alias: "jobInfo",
        fields: [
          {
            id: 4028,
            name: "Job Information: Date",
            alias: "date",
            type: "date",
          },
          {
            id: 18,
            name: "Location",
            alias: "location",
            type: "list",
          },
          {
            id: 4,
            name: "Department",
            alias: "department",
            type: "list",
          },
          {
            id: 1355,
            name: "Division",
            alias: "division",
            type: "list",
          },
          {
            id: 17,
            name: "Job Title",
            alias: "jobTitle",
            type: "list",
          },
          {
            id: 91,
            name: "Reporting to",
            alias: "reportsTo",
            type: "employee",
          },
        ],
      },
    ],
  },
});

// Wraps https://documentation.bamboohr.com/reference/add-employee-table-row-1
export const addEmployeeTableRow = action({
  display: {
    label: "Add Table Row",
    description: "Adds a row to the specified table for an employee",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.post(
      `/v1/employees/${params.employeeId}/tables/${params.tableName}`,
      params.tableFieldValues
    );
    return { data };
  },
  inputs: {
    connection: connectionInput,
    employeeId,
    tableName,
    tableFieldValues,
  },
});

export const updateEmployeeTableRow = action({
  display: {
    label: "Update Employee Table Row",
    description: "Updates a specific row in an Employee Table",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.post(
      `/v1/employees/${params.employeeId}/tables/${params.tableName}/${params.rowId}`,
      params.tableFieldValues
    );
    return { data };
  },
  inputs: {
    connection: connectionInput,
    employeeId,
    tableName,
    rowId,
    tableFieldValues,
  },
});

export default {
  addEmployeeTableRow,
  getEmployeeTable,
  getTabularFields,
  updateEmployeeTableRow,
};
