import axios from "axios";
import { Credential, AuthorizationDefinition } from "@prismatic-io/spectral";

export const authorization: AuthorizationDefinition = {
  required: true, // Credentials are required for all actions
  methods: ["api_key", "oauth2"], // Accept both API keys and OAuth 2.0 credentials
};

export function getAcmeErpClient(endpointUrl: string, credential: Credential) {
  // Save the api_key or OAuth 2.0's access_token into a variable, token
  let token;
  switch (credential.authorizationMethod) {
    case "api_key":
      token = credential.fields.api_key;
      break;
    case "oauth2":
      token = credential.token.access_token;
      break;
    default:
      throw new Error(
        `Unsupported credential type: ${credential.authorizationMethod}.`
      );
  }

  // Return an HTTP client that has been configured to point
  // towards endpointUrl, and passes an access token as a header
  return axios.create({
    baseURL: endpointUrl,
    headers: {
      Accept: "application/json", // Our API returns JSON
      Authorization: `Bearer ${token}`,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
