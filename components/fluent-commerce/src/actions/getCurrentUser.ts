import { action } from "@prismatic-io/spectral";
import { createFluentClient } from "../client";
import { connectionInput } from "../inputs";
import { gql } from "graphql-request";

const getCurrentUser = action({
  display: {
    label: "Get Current User",
    description: "Get information about the currently authenticated user",
  },
  inputs: { connection: connectionInput },
  perform: async (context, params) => {
    const client = await createFluentClient(params.connection);
    const query = gql`
      {
        me {
          id
          username
          title
          firstName
          lastName
          primaryEmail
          primaryPhone
          type
          status
          attributes {
            name
            type
            value
          }
          department
          country
          timezone
          language {
            value
            label
          }
          promotionOptIn
          primaryRetailer {
            id
            tradingName
          }
          primaryLocation {
            id
            type
            status
            name
          }
          roles {
            role {
              id
              name
              permissions {
                name
              }
            }
          }
          apps {
            id
            name
            version {
              major
              minor
              patch
            }
          }
        }
      }
    `;
    const data = await client.request(query);
    return { data };
  },
});

export default {
  getCurrentUser,
};
