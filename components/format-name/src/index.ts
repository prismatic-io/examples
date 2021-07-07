import { action, component, input } from "@prismatic-io/spectral";

const firstName = input({
  label: "First Name",
  placeholder: "First name of a person",
  type: "string",
  required: true,
});

const middleName = input({
  label: "Middle Name",
  placeholder: "Middle name of a person",
  type: "string",
  required: false,
  default: "",
  comments: "Leave blank if the user has no middle name",
});

const lastName = input({
  label: "Last Name",
  placeholder: "Last name of a person",
  type: "string",
  required: true,
});

export const properFormatName = action({
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
  inputs: { firstName, middleName, lastName },
});

export const improperFormatName = action({
  display: {
    label: "Informally Format Name",
    description: "Informally format a person's name (My main man, FIRSTNAME)",
  },
  perform: async (context, { firstName }) => {
    return {
      data: `My main man, ${firstName}`,
    };
  },
  inputs: { firstName },
});

export default component({
  key: "format-name",
  public: false,
  display: {
    label: "Format Name",
    description: "Format a person's name given a first, middle, and last name",
    iconPath: "icon.png",
  },
  actions: {
    improperFormatName,
    properFormatName,
  },
});
