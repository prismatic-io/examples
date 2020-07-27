import { input } from "@prismatic-io/spectral";

export const signatureInputField = input({
  key: "signature",
  label: "Signature",
  placeholder: "Signature contained in X-Progix-Signature Header",
  type: "string",
  required: true,
  comments:
    "HMAC SHA1 hash constructed from the request body and known secret with hyphens removed",
});

export const bodyInputField = input({
  key: "body",
  label: "Request Body",
  placeholder: "Request Body",
  type: "string",
  required: true,
  comments:
    "The body of the request. Must be the raw body string, as order of attributes is important.",
});

export const secretInputField = input({
  key: "secret",
  label: "Secret",
  placeholder: "Secret",
  type: "string",
  required: true,
  comments:
    "The secret to use when constructing the signature of the request body to compare against the provided signature",
});
