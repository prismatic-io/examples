import { action, input, KeyValuePair, util } from "@prismatic-io/spectral";
import { createFluentClient } from "../client";
import { connectionInput } from "../inputs";
import { gql, Variables } from "graphql-request";

const createCustomer = action({
  display: {
    label: "Create Customer",
    description: "Create a new customer",
  },
  inputs: {
    connection: connectionInput,
    retailerId: input({
      label: "Retailer ID",
      type: "string",
      example: "34",
      required: true,
      clean: util.types.toString,
      comments: "The ID of the retailer (a number)",
    }),
    customerEmail: input({
      label: "Customer Email",
      type: "string",
      example: "test@example.com",
      required: true,
      clean: util.types.toString,
      comments: "The email address of the customer",
    }),
    firstName: input({
      label: "First Name",
      type: "string",
      example: "John",
      required: true,
      clean: util.types.toString,
      comments: "The first name of the customer (required)",
    }),
    lastName: input({
      label: "Last Name",
      type: "string",
      example: "Doe",
      required: false,
      clean: util.types.toString,
      comments: "The last name of the customer",
    }),
    phoneNumber: input({
      label: "Phone Number",
      type: "string",
      example: "Doe",
      required: false,
      clean: util.types.toString,
      comments: "The customer's phone number",
    }),
    country: input({
      label: "Country",
      type: "string",
      example: "Australia",
      required: false,
      clean: util.types.toString,
      comments: "The customer's country",
    }),
    timezone: input({
      label: "Time Zone",
      type: "string",
      example: "UTC+5",
      required: false,
      clean: util.types.toString,
      comments: "The customer's time zone",
    }),
    promotionOptIn: input({
      label: "Promotion Opt In",
      type: "boolean",
      required: true,
      clean: util.types.toBool,
    }),
    attributes: input({
      label: "Attributes",
      type: "string",
      required: false,
      collection: "keyvaluelist",
      clean: (attributes: any) =>
        attributes.map((attribute: KeyValuePair) => ({
          name: attribute.key,
          type: "STRING",
          value: attribute.value,
        })),
      comments: "Custom attributes you would like to apply to the customer",
    }),
  },
  perform: async (context, params) => {
    const client = await createFluentClient(params.connection);

    const query = gql`
      mutation createCustomer(
        $retailerId: ID!
        $customerEmail: String!
        $firstName: String!
        $lastName: String
        $phoneNumber: String
        $country: String
        $timezone: String!
        $attributes: [AttributeInput]
        $promotionOptIn: Boolean!
      ) {
        createCustomer(
          input: {
            username: $customerEmail
            firstName: $firstName
            lastName: $lastName
            primaryEmail: $customerEmail
            primaryPhone: $phoneNumber
            promotionOptIn: $promotionOptIn
            timezone: $timezone
            country: $country
            retailer: { id: $retailerId }
            attributes: $attributes
          }
        ) {
          id
          username
          primaryEmail
          primaryPhone
          firstName
          lastName
          timezone
          country
          promotionOptIn
          retailer {
            id
          }
          attributes {
            name
            type
            value
          }
        }
      }
    `;

    const variables: Variables = {
      retailerId: params.retailerId,
      customerEmail: params.customerEmail,
      firstName: params.firstName,
      lastName: params.lastName,
      phoneNumber: params.phoneNumber,
      promotionOptIn: params.promotionOptIn,
      country: params.country,
      timezone: params.timezone,
      attributes: params.attributes,
    };

    const data = await client.request(query, variables);
    return { data };
  },
});

const getCustomerByEmailAddress = action({
  display: {
    label: "Get Customer by Email",
    description: "Find a customer by their email address",
  },
  inputs: {
    connection: connectionInput,
    emailAddress: {
      label: "Customer Email Address",
      type: "string",
      required: true,
      clean: util.types.toString,
      comments: "The customer's email address",
    },
  },
  perform: async (context, params) => {
    const client = await createFluentClient(params.connection);

    const query = gql`
      query GetCustomerByEmailAddress($emailAddress: String) {
        customers(primaryEmail: [$emailAddress]) {
          edges {
            node {
              id
              ref
              firstName
              lastName
              username
              primaryEmail
              primaryPhone
              timezone
              attributes {
                name
                type
              }
            }
          }
        }
      }
    `;

    const variables = { emailAddress: params.emailAddress };

    const data = await client.request(query, variables);

    return { data };
  },
});

export default { createCustomer, getCustomerByEmailAddress };
