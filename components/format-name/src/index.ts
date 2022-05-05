import { action, component, input, util } from "@prismatic-io/spectral";

const firstName = input({
  label: "First Name",
  placeholder: "First name of a person",
  type: "string",
  required: true,
  clean: (value) => util.types.toString(value),
});

const middleName = input({
  label: "Middle Name",
  placeholder: "Middle name of a person",
  type: "string",
  required: false,
  default: "",
  comments: "Leave blank if the user has no middle name",
  clean: (value) => util.types.toString(value),
});

const lastName = input({
  label: "Last Name",
  placeholder: "Last name of a person",
  type: "string",
  required: true,
  clean: (value) => util.types.toString(value),
});

export const properFormatName = action({
  display: {
    label: "Properly Format Name",
    description: "Properly format a person's name (Last, First M.)",
  },
  perform: async (context, params) => {
    if (params.middleName) {
      return {
        data: `${params.lastName}, ${params.firstName} ${params.middleName[0]}.`,
      };
    } else {
      return { data: `${params.lastName}, ${params.firstName}` };
    }
  },
  inputs: { firstName, middleName, lastName },
});

export const improperFormatName = action({
  display: {
    label: "Informally Format Name",
    description: "Informally format a person's name (My main man, FIRSTNAME)",
  },
  perform: async (context, params) => {
    return {
      data: `My main man, ${params.firstName}`,
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
