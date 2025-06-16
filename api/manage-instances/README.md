# Programmatically Manage Instances

This script demonstrates how to programmatically query for all active instances through Prismatic's GraphQL API, and delete or disable them.
Documentation for the API can be found at [prismatic.io/docs](https://prismatic.io/docs/api/api-overview/).

`index.ts` creates an authenticated GraphQL client and uses that client to make requests to the Prismatic API.
Files in the `queries/` directory wrap various GraphQL queries and mutations to do things like list instances or disable or delete instances.

## Running this script

To run this script, you will need to supply an API key and an action you would like to perform on an instance, and the ID or name of the instance.
Those values can be shared as environment variables `PRISMATIC_API_KEY`,`ACTION`,and `IDENTIFIER` respectively.
If you have the [prism CLI tool](https://www.npmjs.com/package/@prismatic-io/prism) installed, you can use it to fetch a valid token:

```bash
PRISMATIC_API_KEY=$(prism me:token) ACTION=disable IDENTIFIER=SW5zdGFuY2U6OT... npm run start
```

## Extending this script

This script is meant to be used as an example to illustrate how to programmatically list instances, and disable or delete instances.
You can extend this script's logic however you like.
For example, there may only be a set of instances you want to disable, each of those instances have a specific label you can query for.
Or, you may want to loop through all instances and disable specific ones by a particular Id.
Use this script as a jumping-off point to build your own logic to manage your instances.
