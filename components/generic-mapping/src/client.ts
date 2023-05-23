import { Connection } from "@prismatic-io/spectral";

const getSourceFields = async () => {
  const sourceFields = [
    { title: "ID", const: "id" },
    { title: "Title", const: "title" },
    { title: "Start Date", const: "startDate" },
    { title: "End Date", const: "endDate" },
    { title: "Start Time", const: "startTime" },
    { title: "End Time", const: "endTime" },
    { title: "Owner Email", const: "ownerEmail" },
    { title: "Address", const: "address" },
    { title: "City", const: "city" },
    { title: "State", const: "state" },
    { title: "Zip", const: "zip" },
    { title: "Country", const: "country" },
    { title: "Description", const: "description" },
  ];
  return Promise.resolve(sourceFields);
};
export const createClient = (connection: Connection) => {
  // Create a client using the provided Connection for the
  // service you're consuming from this Component.
  return {
    getSourceFields,
  };
};
