import { action, input } from "@prismatic-io/spectral";
import { createBambooClient } from "../client";
import {
  connectionInput,
  employeeId,
  endDate,
  startDate,
  timeOffRecordId,
  timeOffStatus,
} from "../inputs";
import { filterFalseyValues } from "../util";

// Wraps https://documentation.bamboohr.com/reference/time-off-get-time-off-requests-1
const getTimeOffRequests = action({
  display: {
    label: "Get Time Off Requests",
    description: "Gets Employee Time Off Requests for a given date range.",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const queryParams = filterFalseyValues({
      id: params.timeOffRecordId,
      employeeId: params.employeeId,
      start: params.startDate,
      end: params.endDate,
      status: params.timeOffStatus,
    });
    const { data } = await client.get("/v1/time_off/requests/", {
      params: queryParams,
    });
    return { data };
  },
  inputs: {
    connection: connectionInput,
    timeOffRecordId,
    employeeId: { ...employeeId, required: false },
    startDate,
    endDate,
    timeOffStatus,
  },
  examplePayload: {
    data: [
      {
        id: "1342",
        employeeId: "4",
        status: {
          lastChanged: "2022-04-10",
          lastChangedByUserId: "2369",
          status: "approved",
        },
        name: "Charlotte Abbott",
        start: "2021-12-26",
        end: "2021-12-28",
        created: "2022-04-09",
        type: { id: "78", name: "Vacation", icon: "palm-trees" },
        amount: { unit: "hours", amount: "24" },
        actions: {
          view: true,
          edit: true,
          cancel: false,
          approve: false,
          deny: false,
          bypass: false,
        },
        dates: { "2021-12-26": "24" },
        notes: { manager: "Home sick with the flu." },
      },
    ],
  },
});

// Wraps https://documentation.bamboohr.com/reference/get-a-list-of-whos-out-1
const whosOut = action({
  display: {
    label: "List Who's Out",
    description: "Get a list of all employees currently taking time off",
  },
  inputs: {
    connection: connectionInput,
    startDate: input({
      label: "Start Date",
      type: "string",
      required: false,
      example: "YYYY-MM-DD",
      comments: "Defaults to today's date if omitted",
    }),
    endDate: input({
      label: "End Date",
      type: "string",
      required: false,
      example: "YYYY-MM-DD",
      comments: "Defaults to 14 days from start date if omitted",
    }),
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get("/v1/time_off/whos_out", {
      params: filterFalseyValues({
        start: params.startDate,
        end: params.endDate,
      }),
    });
    return { data };
  },
  examplePayload: {
    data: [
      {
        id: 1493,
        type: "timeOff",
        employeeId: 17,
        name: "Dorothy Chou",
        start: "2022-08-17",
        end: "2022-08-18",
      },
    ],
  },
});

export default { getTimeOffRequests, whosOut };
