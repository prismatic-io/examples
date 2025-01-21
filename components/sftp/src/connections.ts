import {
  OnPremConnectionDefinition,
  onPremConnection,
} from "@prismatic-io/spectral";

const commonInputs = {
  username: {
    label: "Username",
    placeholder: "Username",
    type: "string",
    required: true,
    example: "john.doe",
  },
  host: {
    label: "Host",
    placeholder: "Name of the host",
    type: "string",
    required: true,
    comments:
      "The address of the SFTP server. This should be either an IP address or hostname.",
    example: "sftp.prismatic.io",
    onPremControlled: true,
  },
  port: {
    label: "Port",
    placeholder: "Port of the host",
    default: "22",
    required: true,
    comments: "The port of the SFTP server.",
    type: "string",
    example: "2222",
    onPremControlled: true,
  },
  timeout: {
    label: "Timeout",
    placeholder: "Timeout",
    required: false,
    comments: "How long the client will await a request.",
    type: "string",
    default: "3000",
    example: "4000",
  },
} as OnPremConnectionDefinition["inputs"];

export const basic = onPremConnection({
  key: "basic",
  label: "Basic Username/Password",
  comments: "Basic Username and Password connection",
  inputs: {
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      example: "p@s$W0Rd",
    },
    ...commonInputs,
    enableUnsecureCiphers: {
      label: "Enable Unsecure Ciphers",
      comments: "If true, CBC ciphers will be added to the connection.",
      required: false,
      type: "boolean",
    },
  },
});

export const privateKey = onPremConnection({
  key: "privateKey",
  label: "Private Key",
  comments: "Private key connection",
  inputs: {
    privateKey: {
      label: "Private Key",
      placeholder: "SSH Private Key",
      type: "text",
      required: true,
      comments: "SSH private key",
      example: "-----BEGIN OPENSSH PRIVATE KEY-----\nabc123...",
    },
    passphrase: {
      label: "Key Passphrase",
      placeholder: "Passphrase",
      type: "password",
      required: false,
      comments: "Passphrase for the private key. Leave blank if none.",
      example: "p@s$PHr@$3",
    },
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: false,
      comments:
        "Though uncommon, some SFTP servers that use private keys may also require a password. Leave blank if none.",
      example: "p@s$W0Rd",
    },
    ...commonInputs,
    enableUnsecureCiphers: {
      label: "Enable CBC Ciphers",
      comments: "If true, CBC ciphers will be added to the connection.",
      required: false,
      type: "boolean",
    },
  },
});

export default [basic, privateKey];
