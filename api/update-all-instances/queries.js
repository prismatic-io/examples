const { gql } = require("graphql-request");

const GET_INTEGRATION_VERSIONS = gql`
  query ($integrationName: String!) {
    integrations(
      name: $integrationName
      allVersions: true
      versionIsAvailable: true
      sortBy: { direction: DESC, field: VERSION_NUMBER }
    ) {
      nodes {
        id
        name
        versionNumber
      }
    }
  }
`;

const GET_INSTANCES = gql`
  query ($integrationId: ID!) {
    instances(integration: $integrationId, isSystem: false, enabled: true) {
      nodes {
        id
        name
        customer {
          name
        }
      }
    }
  }
`;

const UPDATE_INSTANCE_VERSION = gql`
  mutation ($instanceId: ID!, $integrationId: ID!) {
    updateInstance(input: { id: $instanceId, integration: $integrationId }) {
      errors {
        field
        messages
      }
    }
  }
`;

const UPDATE_INSTANCE_API_KEY = gql`
  mutation ($instanceId: ID!, $configVariables: [InputInstanceConfigVariable]) {
    updateInstanceConfigVariables(
      input: { id: $instanceId, configVariables: $configVariables }
    ) {
      instance {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

const DEPLOY_INSTANCE = gql`
  mutation ($instanceId: ID!) {
    deployInstance(input: { id: $instanceId }) {
      errors {
        field
        messages
      }
    }
  }
`;

module.exports = {
  GET_INTEGRATION_VERSIONS,
  GET_INSTANCES,
  UPDATE_INSTANCE_VERSION,
  UPDATE_INSTANCE_API_KEY,
  DEPLOY_INSTANCE,
};
