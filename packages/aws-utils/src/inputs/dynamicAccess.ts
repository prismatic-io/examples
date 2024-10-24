import { input, util } from "@prismatic-io/spectral";

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: false,
});

export const dynamicAccessKeyId = input({
  label: "Dynamic Access Key ID",
  type: "string",
  required: false,
  clean: util.types.toString,
  comments:
    "Use this input to authenticate with AWS if you are using a dynamically-generated access key. Otherwise, use the connection to enter a static access key ID.",
});

export const dynamicSecretAccessKey = input({
  label: "Dynamic Secret Access Key",
  type: "password",
  required: false,
  clean: util.types.toString,
  comments:
    "Use this input to authenticate with AWS if you are using a dynamically-generated secret access key. Otherwise, use the connection to enter a static secret access key.",
});

export const dynamicSessionToken = input({
  label: "Dynamic Session Token",
  type: "password",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
  comments:
    "Use this input to authenticate with AWS if you are using a OPTIONAL dynamically-generated session token.",
});

export const dynamicAccessAllInputs = {
  dynamicAccessKeyId,
  dynamicSecretAccessKey,
  dynamicSessionToken,
};
