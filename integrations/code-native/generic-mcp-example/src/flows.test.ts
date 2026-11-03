import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { searchPeople } from "./flows";

const acmeConnection = {
  "Acme Connection": {
    key: "acme-connection",
    fields: {
      baseUrl: "https://jsonplaceholder.typicode.com",
      apiKey: "dummy-api-key",
    },
  },
};

test("Test searchPeople flow", async () => {
  const expectedResult = [
    {
      id: 3,
      name: "Clementine Bauch",
      username: "Samantha",
      email: "Nathan@yesenia.net",
      address: {
        street: "Douglas Extension",
        suite: "Suite 847",
        city: "McKenziehaven",
        zipcode: "59590-4157",
        geo: {
          lat: "-68.6102",
          lng: "-47.0653",
        },
      },
      phone: "1-463-123-4447",
      website: "ramiro.info",
      company: {
        name: "Romaguera-Jacobson",
        catchPhrase: "Face to face bifurcated interface",
        bs: "e-enable strategic applications",
      },
    },
    {
      id: 10,
      name: "Clementina DuBuque",
      username: "Moriah.Stanton",
      email: "Rey.Padberg@karina.biz",
      address: {
        street: "Kattie Turnpike",
        suite: "Suite 198",
        city: "Lebsackbury",
        zipcode: "31428-2261",
        geo: {
          lat: "-38.2386",
          lng: "57.2232",
        },
      },
      phone: "024-648-3804",
      website: "ambrose.net",
      company: {
        name: "Hoeger LLC",
        catchPhrase: "Centralized empowering task-force",
        bs: "target end-to-end models",
      },
    },
  ];
  const { result } = await invokeFlow(searchPeople, {
    configVars: acmeConnection,
    payload: {
      body: {
        data: {
          first: "Clem",
        },
      },
    },
  });
  expect(result?.data).toEqual(expectedResult);
});
