import { USERS_TO_IMPORT } from "./users";

import { fetchExistingConnection } from "./fetchExistingConnection";
import { createReusableConnection } from "./createReusableConnection";

async function main() {
  /**
   * Loop over each user, signing an embedded JWT for each user and using that JWT to create a reusable user connection
   */
  for (const user of USERS_TO_IMPORT) {
    const existingConnection = await fetchExistingConnection(user);
    await createReusableConnection({ existingConnection, user });
  }
}

main();
