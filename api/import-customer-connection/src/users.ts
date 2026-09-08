export interface User {
  externalId: string;
  name: string;
  customerId: string;
  customerName: string;
}

export const USERS_TO_IMPORT: User[] = [
  {
    externalId: "9D9354AF-AC52-4655-A7DC-6A049A5BCAF4",
    name: "My User 1",
    customerId: "95E7B3EA-3ED3-4C70-A3C1-22D189CE458D",
    customerName: "My Customer 1",
  },
  {
    externalId: "D11FE042-F820-4396-BBEB-F5262CBAB2C9",
    name: "My User 2",
    customerId: "95E7B3EA-3ED3-4C70-A3C1-22D189CE458D",
    customerName: "My Customer 1",
  },
  {
    externalId: "3B8CC68A-D2A3-4DC7-964B-C63D35317BFC",
    name: "My User 3",
    customerId: "E06E2E3E-262B-4DA8-877A-7C35A1B4C92D",
    customerName: "My Customer 2",
  },
];
