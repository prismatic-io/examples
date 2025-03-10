import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import type { Connection } from "@prismatic-io/spectral";
import path from "path";

export const createClient = (connection: Connection, service: string) => {
  const PROTO_PATH = path.resolve(__dirname, "protoFiles/helloworld.proto");

  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const helloProto = grpc.loadPackageDefinition(packageDefinition) as any;

  const client = new helloProto[service](
    "grpc.postman-echo.com",
    grpc.credentials.createInsecure()
  );

  const auth =
    "Basic " +
    Buffer.from(
      `${connection.fields.username}:${connection.fields.password}`
    ).toString("base64");

  const requestMetadata = new grpc.Metadata();
  requestMetadata.set("Authentication", auth);

  return { client, requestMetadata };
};
