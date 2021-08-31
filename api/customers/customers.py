#!/usr/bin/env python3

import json
import os
import sys
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

token = os.environ['PRISMATIC_API_KEY']
api_endpoint = "https://app.prismatic.io/api/"

transport = RequestsHTTPTransport(
  url=api_endpoint,
  headers={'Authorization': f'Bearer {token}'}
)
client = Client(transport=transport)

# Get all existing customers.
# This will return an object that has this form:
# [
#   {
#     "id": "Q3VzdG9tZXI6MThjZTBjM2EtYmQ5NS00MWJiLWIyMjUtN2MwYjVjMDg3YmE4",
#     "name": "Mars Missions",
#     "description": "Mars Missions Corp",
#     "externalId": "abc-123"
#   },
#   {
#     "id": "Q3VzdG9tZXI6MDllZDQyNTctMTNkMS00YTY4LWFiNTktY2Y5NzNmZGUyOTQy",
#     "name": "Eastern Space Flight",
#     "description": "Eastern Space Flight - Houston, TX",
#     "externalId": "foobar"
#   },
# ]
# Pagination is used to ensure that all customers are retrieved
def getCustomers():
  query = gql("""
    query ($startCursor:String){
      customers(after: $startCursor, isSystem: false) {
        nodes {
          id
          name
          description
          externalId
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  """)

  cursor = ""
  hasNextPage = True
  customers = [] # Used to accumulate customer objects

  while hasNextPage:
    result = client.execute(query, variable_values={"startCursor": cursor})
    customers += result['customers']['nodes']
    hasNextPage = result['customers']['pageInfo']['hasNextPage']
    cursor = result['customers']['pageInfo']['endCursor']
  
  return customers

# Get a single customer by external ID
# This will return an object of the form:
#  {"id": "Q3VzdG9tZXI6MThjZTBjM2EtYmQ5NS00MWJiLWIyMjUtN2MwYjVjMDg3YmE4", "name": "Mars Missions", "description": "Mars Missions Corp", "externalId": "abc-123"}
def getCustomerByExternalId(externalId):
  query = gql("""
    query ($externalId: String!) {
      customers (externalId: $externalId) {
        nodes {
          id
          name
          description
          externalId
        }
      }
    }
  """)
  params = {"externalId": externalId}
  response = client.execute(query, variable_values=params)
  assert len(response["customers"]["nodes"]) == 1, f"No customer with external ID '{externalId}' exists."
  return response["customers"]["nodes"][0]


# Creates a new customer given a customer's name, description, and external ID.
# If such a customer already exists, this will raise an exception.
# If the creation is successful, this will return an object containing a customer object with an id, name, description, and externalId.
# Note: name and externalId must be unique from any other customers.
def createCustomer(name, description="", externalId=""):
  mutation = gql("""
    mutation ($name: String!, $description: String, $externalId: String) {
      createCustomer(
        input:{
          name: $name,
          description:$description, 
          externalId:$externalId
          }
        ) {
          customer {
            id,
            name,
            description,
            externalId
          }
          errors {
            messages
          }
        }
    }
  """)

  params = {
    "name": name,
    "description": description,
    "externalId": externalId
  }

  result = client.execute(mutation, variable_values=params)

  if ("errors" in result):
    raise Exception(result.errors)
  else:
    return result["createCustomer"]["customer"]

# Delete an customer by externalId
# First, we look up the customer using getCustomerByExternalId() (defined above), and then
# run a deleteCustomer() mutation on the ID that we receive.
def deleteCustomer(externalId):
  customer = getCustomerByExternalId(externalId)
  mutation = gql("""
    mutation ($id: ID!) {
      deleteCustomer(
        input: {
          id: $id
        }
      ) {
        customer {
          id
          name
          description
          externalId
        }
        errors {
          messages
        }
      }
    }
  """)

  params = {"id": customer["id"]}

  result = client.execute(mutation, variable_values=params)

  if ("errors" in result):
    raise Exception(result.errors)
  else:
    return result["deleteCustomer"]["customer"]

# Test each function:
# print(json.dumps(getCustomers()))
# print(json.dumps(getCustomerByExternalId("abc-123")))
# print(json.dumps(createCustomer(name="Rockets Rockets Rockets", description="Rockets^3", externalId="456-xyz")))
# print(json.dumps(deleteCustomer(externalId="456-xyz")))