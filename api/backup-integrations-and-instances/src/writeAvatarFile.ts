import fs from "fs";
import { PRISMATIC_API_KEY } from "./client";
import { PRISMATIC_API_ENDPOINT } from "./config";

async function writeAvatarFile(avatarUrl: string, filePath: string) {
  const prismaticBaseUrl = new URL(PRISMATIC_API_ENDPOINT).origin;
  const response = await fetch(`${prismaticBaseUrl}${avatarUrl}`, {
    headers: { Authorization: `Bearer ${PRISMATIC_API_KEY}` },
  });
  const { url } = await response.json();
  const avatarResponse = await fetch(url);
  fs.writeFileSync(filePath, Buffer.from(await avatarResponse.arrayBuffer()));
}

export default writeAvatarFile;
