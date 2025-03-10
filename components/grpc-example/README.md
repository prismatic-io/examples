# Example Prismatic gRPC Connector

This connector demonstrates how to build a basic connector that fetches data from a gRPC-based API.

## Required packages

This connector depends on two NodeJS packages: [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/proto-loader) and [@grpc/proto-loader](https://www.npmjs.com/package/@grpc/proto-loader), which can be installed with:

```sh
npm install @grpc/grpc-js @grpc/proto-loader
```

## Loading .proto files

gRPC service definitions are written as [.proto](https://grpc.io/docs/what-is-grpc/core-concepts/#service-definition) files.
These files declare what methods are available to be called, and what parameters each expects (and returns).
To load a `.proto` file in a custom component, place the `.proto` files in `src/protoFiles` and reference them as shown in [client.ts](./src/client.ts).

### Packing .proto files

Service definition files must be included in your compiled connector build.
This can be done by automatically copying your `src/protoFiles` directory into the `dist/` directory at build time.
Note that [webpack.config.js](./webpack.config.js) contains this configuration:

```js
{
  from: path.resolve(__dirname, "src", "protoFiles"),
  to: path.resolve(__dirname, "dist", "protoFiles"),
},
```

## Running locally

The "Say Hello" [action](./src/actions.ts) can be run locally by running `npm run test`.
