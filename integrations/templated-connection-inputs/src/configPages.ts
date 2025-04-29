import {
  configPage,
  connectionConfigVar,
  OAuth2Type,
  templateConnectionInputs,
} from "@prismatic-io/spectral";

export const configPages = {
  Connections: configPage({
    elements: {
      "Acme Connection": connectionConfigVar({
        stableKey: "4051ad6a-2919-418f-998a-f73d32f42097",
        dataType: "connection",
        oauth2Type: OAuth2Type.AuthorizationCode,
        inputs: templateConnectionInputs(
          {
            host: {
              label: "Host",
              type: "string",
              required: true,
              shown: true,
              comments:
                "Your acme host URL. The **HOST** portion of https://HOST/api/acme",
            },
            consultant_number: {
              label: "Consultant number",
              comments:
                "Your **consultant number** is available in the **settings** menu if you click **Settings** > **Client Info** > **View Consultant number**",
              type: "string",
              required: true,
              shown: true,
            },
            client_number: {
              label: "Client number",
              comments:
                "Your **client number** is available in the **settings** menu if you click **Settings** > **Client Info** > **View Client number**",
              type: "string",
              required: true,
              shown: true,
            },
            clientId: {
              label: "Client ID",
              placeholder: "Client ID",
              type: "string",
              required: true,
              shown: false,
              default: "my-client-id",
            },
            clientSecret: {
              label: "Client Secret",
              placeholder: "Client Secret",
              type: "password",
              required: true,
              shown: false,
              default: "my-client-secret",
            },
          },
          {
            authorizeUrl: {
              label: "Authorize URL",
              type: "template",
              templateValue: "https://{{#host}}/oauth2/authorize",
            },
            tokenUrl: {
              label: "Token URL",
              type: "template",
              templateValue: "https://{{#host}}/oauth2/token",
            },
            scopes: {
              label: "Scopes",
              templateValue:
                "openid profile offline_access accounting:clients:read acme:iam:client:{{#consultant_number}}-{{#client_number}}",
              type: "template",
            },
          }
        ),
      }),
    },
  }),
};
