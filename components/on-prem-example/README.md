# On-prem component example

The [on-prem agent](https://prismatic.io/docs/on-prem-agent) is a tool that allows you to connect to services on a private network, like a database, file storage system or an API that is not internet-accessible.

This example component demonstrates how to build an on-prem-compatible component that can access an HTTP-based service running on a private network.

- `example-opa-component/` contains the example component that can connect to an on-prem agent to make API calls to a private network
- `mock-service/` is a simple "hello world" HTTP service that can be run on your local (private) network
- `docker-compose.yml` is a Docker compose file that will spin up containers for both the mock service and on-prem agent
- `on-prem-agent.env` contains environment variables for the on-prem agent docker container

## Running the mock service and on-prem agent

To run the on-prem agent or mock service, you will need [Docker](https://www.docker.com/) installed, and the ability to run `docker-compose` from your command line.

First, you'll need to generate a registration token for your on-prem agent. See [on-prem agent](https://prismatic.io/docs/on-prem-agent) in the Prismatic documentation.
Export the token you generate as an environment variable

```bash
export REGISTRATION_JWT=eyJ0.....
```

Next, start both the on-prem agent and mock service with `docker-compose up`.
If the on-prem agent connects successfully, you should see logs like this in your terminal:

```
docker-compose up

[+] Running 2/0
 ✔ Container on-prem-example-mock-service-1  Created
 ✔ Container on-prem-example-on-prem-agent-1 Created
Attaching to mock-service-1, on-prem-agent-1
on-prem-agent-1  | Registering On Premise Resource...
mock-service-1   | Example app listening on port 3000
on-prem-agent-1  | Registered successfully.
on-prem-agent-1  | 2024-05-17 21:12:24.128 info On-Premise Agent is running.
```

The mock service will be accessible at `localhost:3000`, though will throw an error unless you specify a `host` header of `api.example.com`.

## The example on-prem-compatible component

- `example-opa-component/src/connections.ts` contains the on-prem-compatible connection declaration.
  Note that the `host` and `port` inputs are marked `shown: false, required: false`.
  For this component, if `host` and `port` are present, that indicates that the connection is configured for on-prem.
  If they are absent, the connection is not configured for on-prem, and instead is configured for an internet-accessible endpoint.
- `example-opa-component/src/client.ts` contains an HTTP client that connects to the mock service.
  Note that when `host` and `port` are defined we generate a `baseUrl` from those values.
  When they are not defined, we use the `endpoint` input on the connection as the `baseUrl`.

To build and publish the component,

```bash
cd example-opa-component
yarn install
yarn build
prism components:publish
```

You can now use the example opa component in an integration, enable on-prem connections for that component, and configure your instances to use an on-prem connection.
