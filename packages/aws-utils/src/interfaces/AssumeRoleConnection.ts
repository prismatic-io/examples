import { ConnectionInput } from "@prismatic-io/spectral";
export interface AssumeRoleConnection {
  key: string;
  label: string;
  comments: string;
  inputs: {
    roleARN: ConnectionInput;
    accessKeyId: ConnectionInput;
    secretAccessKey: ConnectionInput;
  };
}
