import { input, util } from "@prismatic-io/spectral";
import { employeeFields, validateDate, validateEmployeeFields } from "./util";

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
});
export const tableName = input({
  label: "Table Name (Alias)",
  type: "string",
  required: true,
  example: "jobInfo",
  clean: util.types.toString,
});
export const firstName = input({
  label: "First Name",
  type: "string",
  required: true,
  clean: util.types.toString,
});
export const lastName = input({
  label: "Last Name",
  type: "string",
  required: true,
  clean: util.types.toString,
});
export const employeeFieldValues = input({
  label: "Employee Fields",
  type: "string",
  collection: "keyvaluelist",
  required: false,
  comments: `The names of the fields and their values to use when creating/updating a record. Possible fields are: ${employeeFields.join(
    ", "
  )}`,
  clean: (values: any) => validateEmployeeFields(values),
});

export const tableFieldValues = input({
  label: "Table Fields",
  type: "string",
  collection: "keyvaluelist",
  required: false,
  comments:
    'The names of the fields and their values to use when creating/updating a row in a table. Use the "List Tabular Fields (Tables)" action to list possible field names for a table.',
  clean: (values: any) => util.types.keyValPairListToObject(values),
});

export const employeeId = input({
  label: "Employee ID",
  type: "string",
  required: true,
  clean: util.types.toString,
  example: "42",
});

export const startDate = input({
  label: "Start Date",
  type: "string",
  required: true,
  example: "YYYY-MM-DD",
  clean: validateDate,
});

export const endDate = input({
  label: "End Date",
  type: "string",
  required: true,
  example: "YYYY-MM-DD",
  clean: validateDate,
});

export const timeOffRecordId = input({
  label: "Time Off Record ID",
  type: "string",
  required: false,
  clean: util.types.toString,
  example: "42",
});

export const timeOffStatus = input({
  label: "Status",
  type: "string",
  required: false,
  model: [
    { label: "Approved", value: "approved" },
    { label: "Denied", value: "denied" },
    { label: "Superceded", value: "superceded" },
    { label: "Canceled", value: "canceled" },
    { label: "Requested", value: "requested" },
  ],
  clean: util.types.toString,
});

export const rowId = input({ label: "Row ID", type: "string", required: true });

export const fileId = input({
  label: "File ID",
  type: "string",
  required: true,
});

export const categoryId = input({
  label: "Category ID",
  type: "string",
  required: true,
  clean: util.types.toString,
  example: "20",
});

export const fileName = input({
  label: "File Name",
  type: "string",
  required: true,
  clean: util.types.toString,
  example: "example.pdf",
});

export const share = input({
  label: "Share?",
  type: "boolean",
  default: "false",
  clean: (value) => (util.types.toBool(value) ? "yes" : "no"),
});

export const file = input({
  label: "File contents",
  type: "string",
  required: true,
  clean: util.types.toData,
});
