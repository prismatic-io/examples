const { gql } = require("graphql-request");

// Query Enabled Instances
const GET_INSTANCES = gql`
  query {
    instances(enabled: true, isSystem: false) {
      nodes {
        enabled
        id
        name
        customer {
          name
        }
      }
    }
  }
`;

// Disable specific instance by Instance Id
const DISABLE_INSTANCE = gql`
  mutation ($id: ID!) {
    updateInstance(input: { id: $id, enabled: false }) {
      instance {
        enabled
        id
        name
      }
      errors {
        field
        messages
      }
    }
  }
`;

// Delete specific Instance by Instance Id
const DELETE_INSTANCE = gql`
  mutation ($id: ID!) {
    deleteInstance(input: { id: $id }) {
      errors {
        field
        messages
      }
      instance {
        enabled
        id
        name
      }
    }
  }
`;

module.exports = {
  GET_INSTANCES,
  DISABLE_INSTANCE,
  DELETE_INSTANCE,
};
