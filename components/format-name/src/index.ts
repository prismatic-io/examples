import { action, component, input } from "@prismatic-io/spectral";
import packageInfo from "../package.json";

const version = packageInfo.version;

const firstNameInputField = input({
  key: "firstName",
  label: "First Name",
  placeholder: "First name of a person",
  type: "string",
  required: true,
});

const middleNameInputField = input({
  key: "middleName",
  label: "Middle Name",
  placeholder: "Middle name of a person",
  type: "string",
  required: false,
  default: "",
  comments: "Leave blank if the user has no middle name",
});

const lastNameInputField = input({
  key: "lastName",
  label: "Last Name",
  placeholder: "Last name of a person",
  type: "string",
  required: true,
});

export const properFormatNameAction = action({
  key: "properFormatName",
  display: {
    label: "Properly Format Name",
    description: "Properly format a person's name (Last, First M.)",
  },
  perform: async (context, { firstName, middleName, lastName }) => {
    if (middleName) {
      return {
        data: `${lastName}, ${firstName} ${middleName[0]}.`,
      };
    } else {
      return { data: `${lastName}, ${firstName}` };
    }
  },
  inputs: [firstNameInputField, middleNameInputField, lastNameInputField],
});

export const improperFormatNameAction = action({
  key: "informalFormatName",
  display: {
    label: "Informally Format Name",
    description: "Informally format a person's name (My main man, FIRSTNAME)",
  },
  perform: async (context, { firstName }) => {
    return {
      data: `My main man, ${firstName}`,
    };
  },
  inputs: [firstNameInputField],
});

export default component({
  key: "format-name",
  public: false,
  version,
  display: {
    label: "Format Name",
    description: "Format a person's name given a first, middle, and last name",
    iconPath: "icon.png",
  },
  actions: {
    ...improperFormatNameAction,
    ...properFormatNameAction,
  },
});
