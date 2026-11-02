/**
 * Get a user from the Prismatic API by email address.
 */
import { GraphQLClient, gql } from "graphql-request";

const GET_USERS_QUERY = gql`
  query myGetUsersByEmail($email: String!) {
    users(email: $email) {
      nodes {
        id
        name
        email
      }
    }
  }
`;

interface UserResponse {
  users: {
    nodes: {
      id: string;
      name: string;
      email: string;
    }[];
  };
}

const getUser = async ({
  client,
  email,
}: {
  client: GraphQLClient;
  email: string;
}) => {
  const { users } = await client.request<UserResponse>(GET_USERS_QUERY, {
    email: email,
  });
  if (users.nodes.length === 0) {
    throw new Error(`No user found with email ${email}`);
  }
  return users.nodes[0];
};

export default getUser;
