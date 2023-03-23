import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput } from "../inputs";
import { handleDropboxError } from "../util";

export const getCurrentAccount = action({
  display: {
    label: "Get Current Account",
    description: "Get information about the currently authenticated user",
  },
  perform: async (context, { dropboxConnection }) => {
    const dbx = await createAuthorizedClient(dropboxConnection);
    try {
      const { result } = await dbx.usersGetCurrentAccount();
      return { data: result };
    } catch (err) {
      handleDropboxError(err);
    }
  },
  inputs: { dropboxConnection: connectionInput },
  examplePayload: {
    data: {
      account_id: "dbid:EXAMPLE",
      name: {
        given_name: "John",
        surname: "Doe",
        familiar_name: "John",
        display_name: "John Doe",
        abbreviated_name: "JD",
      },
      email: "john.doe@example.com",
      email_verified: true,
      profile_photo_url: "",
      disabled: false,
      country: "US",
      locale: "en",
      referral_link: "",
      is_paired: true,
      account_type: { ".tag": "basic" },
      root_info: {
        ".tag": "user",
        root_namespace_id: "123456789",
        home_namespace_id: "123456789",
      },
    },
  },
});
