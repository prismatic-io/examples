interface SlackOauth2Connection {
  type: "connection";
  component: "slack";
  key: "oauth2";
  values: {
    // The OAuth 2.0 Authorization URL for Slack. If you want to request access to the API on behalf of a user, append a 'user_scope' query parameter to the end of the Authorize URL: https://slack.com/oauth/v2/authorize?user_scope=chat:write
    authorizeUrl?: string;
    // The OAuth 2.0 Token URL for Slack
    tokenUrl?: string;
    // The OAuth 2.0 Revocation URL for Slack
    revokeUrl?: string;
    // A space-delimited set of one or more scopes to get the user's permission to access.
    scopes: string;
    clientId: string;
    clientSecret: string;
    signingSecret: string;
    // Flip the flag to true if you want to access the API as a user. If flipped you must also provide a 'user_scope' query parameter to the end of the Authorize URL. Leaving the flag false will grant you a bot token instead.
    isUser?: string;
  };
}

interface SlackSelectChannelsDataSource {
  type: "dataSource";
  component: "slack";
  key: "selectChannels";
  values: {
    // The connection to use
    connection: string;
    // Show '#my-channel' vs. '#my-channel (ID: C123456)'
    showIdInDropdown?: string;
    includePublicChannels?: string;
    includePrivateChannels?: string;
    includeMultiPartyImchannels?: string;
    includeImChannels?: string;
  };
}

export type Components = SlackOauth2Connection | SlackSelectChannelsDataSource;
