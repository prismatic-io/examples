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
  enableUnsecureServerHostKeyAlgorithms: {
    label: "Enable Unsecure Server Host Key Algorithms",
    comments:
      "If true, unsecure server host key algorithms will be added to the connection.",
    required: false,
    type: "boolean",
  },
  enableUnsecureCiphers: {
    label: "Enable Unsecure Ciphers",
    comments: "If true, CBC ciphers will be added to the connection.",
    required: false,
    type: "boolean",
  },
  customServerHostKeyAlgorithms: {
    label: "Custom Server Host Key Algorithms",
    comments:
      "A comma-separated list of custom server host key algorithms. Overrides the default server host key algorithms. Algorithm order matters. Advanced setting.",
    placeholder: "Custom Server Host Key Algorithms",
    example: ["ssh-rsa", "ssh-dss"].join(", "),
    required: false,
    type: "string",
  },
  customCiphers: {
    label: "Custom Ciphers",
    comments:
      "A comma-separated list of custom ciphers. Overrides the default ciphers. Cipher order matters. Advanced setting.",
    placeholder: "Custom Ciphers",
    example: ["aes128-ctr", "aes192-ctr", "aes256-ctr"].join(", "),
    required: false,
    type: "string",
  },
} as OnPremConnectionDefinition["inputs"];

export const basic = onPremConnection({
  key: "basic",
  display: {
    label: "Basic Username/Password",
    description: "Basic Username and Password connection",
  },
  inputs: {
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      example: "p@s$W0Rd",
    },
    ...commonInputs,
  },
});

export const privateKey = onPremConnection({
  key: "privateKey",
  display: {
    label: "Private Key",
    description: "Private Key connection",
  },
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
  },
});

export default [basic, privateKey];
