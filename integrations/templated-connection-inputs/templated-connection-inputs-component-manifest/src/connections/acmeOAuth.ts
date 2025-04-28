export interface AcmeOAuthValues {
  /**
   * Host
   * Your acme host URL. The **HOST** portion of https:\/\/HOST\/api\/acme.
   *
   */
  host: string;
  /**
   * Consultant number
   * Your **consultant number** is available in the **settings** menu if you click **Settings** > **Client Info** > **View Consultant number**.
   *
   */
  consultant_number: string;
  /**
   * Client number
   * Your **client number** is available in the **settings** menu if you click **Settings** > **Client Info** > **View Client number**.
   *
   */
  client_number: string;
}

/**
 * OAuth 2.0
 *
 * @comments Authenticate with Acme
 */
export const acmeOAuth = {
  key: "acmeOAuth",
  perform: (_values: AcmeOAuthValues): Promise<void> => Promise.resolve(),
  inputs: {
    host: {
      inputType: "string",
      collection: undefined,
      default: ``,
      required: true,
    },
    consultant_number: {
      inputType: "string",
      collection: undefined,
      default: ``,
      required: true,
    },
    client_number: {
      inputType: "string",
      collection: undefined,
      default: ``,
      required: true,
    },
  },
} as const;
