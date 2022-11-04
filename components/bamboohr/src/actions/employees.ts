import { action } from "@prismatic-io/spectral";
import { createBambooClient } from "../client";
import {
  connectionInput,
  employeeFieldValues,
  employeeId,
  firstName,
  lastName,
} from "../inputs";
import { employeeFields } from "../util";

// Wraps https://documentation.bamboohr.com/reference/get-employee
const getEmployee = action({
  display: {
    label: "Get Employee",
    description: "Get an Employee",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get(
      `/v1/employees/${params.employeeId}/?fields=${employeeFields.join(",")}`
    );
    return { data };
  },
  inputs: { connection: connectionInput, employeeId },
  examplePayload: {
    data: {
      id: "5",
      address1: "335 S 560 W",
      address2: null,
      age: "41",
      bestEmail: "aadams@efficientoffice.com",
      birthday: "07-28",
      city: "Lindon",
      country: "United States",
      dateOfBirth: "1981-07-28",
      department: "Human Resources",
      division: "Europe",
      employeeNumber: "2",
      employmentHistoryStatus: "Full-Time",
      ethnicity: "Two or More Races",
      exempt: "Exempt",
      firstName: "Ashley",
      fullName1: "Ashley Adams",
      fullName2: "Adams, Ashley",
      fullName3: "Adams, Ashley",
      fullName4: "Adams, Ashley",
      fullName5: "Ashley Adams",
      displayName: "Ashley Adams",
      gender: "Female",
      hireDate: "2022-02-20",
      originalHireDate: "0000-00-00",
      jobTitle: "HR Administrator",
      lastChanged: "2022-08-17T20:35:30+00:00",
      lastName: "Adams",
      location: "London, UK",
      maritalStatus: "Married",
      middleName: null,
      mobilePhone: "+44 207 555 6671",
      payRate: "50000.00 GBP",
      payRateEffectiveDate: "2022-02-20",
      payType: "Salary",
      paidPer: "Year",
      paySchedule: "Twice a month",
      payFrequency: "Twice a month",
      ssn: "545-66-7890",
      state: "UT",
      stateCode: "UT",
      status: "Active",
      supervisor: "Caldwell, Jennifer",
      supervisorEmail: "jcaldwell@efficientoffice.com",
      terminationDate: "0000-00-00",
      workEmail: "aadams@efficientoffice.com",
      workPhone: "+44 207 555 4730",
      zipcode: "84042",
    },
  },
});

// Wraps https://documentation.bamboohr.com/reference/update-employee
const addEmployee = action({
  display: {
    label: "Add Employee",
    description: "Add a new employee",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.post("/v1/employees/", {
      firstName: params.firstName,
      lastName: params.lastName,
      ...params.employeeFieldValues,
    });
    return { data };
  },
  inputs: {
    connection: connectionInput,
    firstName,
    lastName,
    employeeFieldValues,
  },
});

// Wraps https://documentation.bamboohr.com/reference/update-employee
const updateEmployee = action({
  display: {
    label: "Update Employee",
    description: "Update an existing employee",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.post(
      `/v1/employees/${params.employeeId}/`,
      params.employeeFieldValues
    );
    return { data };
  },
  inputs: {
    connection: connectionInput,
    employeeId,
    employeeFieldValues,
  },
});

// Wraps https://documentation.bamboohr.com/reference/get-employees-directory-1
const getEmployeeDirectory = action({
  display: {
    label: "List Employees",
    description: "Get the employee directory",
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.get("/v1/employees/directory");
    return { data };
  },
  inputs: { connection: connectionInput },
  examplePayload: {
    data: {
      fields: [
        {
          id: "displayName",
          type: "text",
          name: "Display Name",
        },
        {
          id: "firstName",
          type: "text",
          name: "First Name",
        },
        {
          id: "lastName",
          type: "text",
          name: "Last Name",
        },
        {
          id: "gender",
          type: "text",
          name: "Gender",
        },
        {
          id: "jobTitle",
          type: "list",
          name: "Job Title",
        },
        {
          id: "workPhone",
          type: "text",
          name: "Work Phone",
        },
        {
          id: "workPhoneExtension",
          type: "text",
          name: "Work Extension",
        },
        {
          id: "skypeUsername",
          type: "text",
          name: "Skype Username",
        },
        {
          id: "facebook",
          type: "text",
          name: "Facebook URL",
        },
      ],
      employees: [
        {
          id: 123,
          displayName: "John Doe",
          firstName: "John",
          lastName: "Doe",
          gender: "Male",
          jobTitle: "Customer Service Representative",
          workPhone: "555-555-5555",
          workPhoneExtension: null,
          skypeUsername: "JohnDoe",
          facebook: "JohnDoeFacebook",
        },
      ],
    },
  },
});

export default {
  addEmployee,
  getEmployee,
  getEmployeeDirectory,
  updateEmployee,
};
