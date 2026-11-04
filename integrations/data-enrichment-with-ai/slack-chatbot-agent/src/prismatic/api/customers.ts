import { OrganizationClient, Customer } from "../types";

/**
 * List all customers for an organization
 * @param client - The authenticated OrganizationClient
 * @returns Array of customers
 */
export async function listCustomers(
  client: OrganizationClient,
): Promise<Customer[]> {
  const query = `
    query listCustomers {
      customers {
        nodes {
          id
          externalId
          name
          description
        }
      }
    }
  `;

  const data = await client.query(query);
  return data.customers?.nodes || [];
}

/**
 * Get a specific customer by external ID
 * @param client - The authenticated OrganizationClient
 * @param externalId - The customer's external ID
 * @returns The customer details
 */
export async function getCustomer(
  client: OrganizationClient,
  externalId: string,
): Promise<Customer | null> {
  const query = `
    query getCustomerByExternalId($externalId: String!) {
      customers(externalId: $externalId) {
        nodes {
          id
          externalId
          name
          description
        }
      }
    }
  `;

  const data = await client.query(query, { externalId });
  const customers = data.customers?.nodes || [];
  return customers.length > 0 ? customers[0] : null;
}

/**
 * Create a new customer
 * @param client - The authenticated OrganizationClient
 * @param customer - The customer details
 * @returns The created customer
 */
export async function createCustomer(
  client: OrganizationClient,
  customer: {
    externalId: string;
    name: string;
    description?: string;
  },
): Promise<Customer> {
  const mutation = `
    mutation createCustomer($input: CustomerCreateInput!) {
      createCustomer(input: $input) {
        customer {
          id
          externalId
          name
          description
        }
      }
    }
  `;

  const data = await client.query(mutation, {
    input: customer,
  });
  return data.createCustomer.customer;
}
