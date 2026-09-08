import type { User } from "./users";

export interface ExistingConnection {
  accessToken: string;
  refreshToken: string;
}

export const fetchExistingConnection = async (
  user: User,
): Promise<ExistingConnection> => {
  return Promise.resolve({
    accessToken: "dummyAccessToken",
    refreshToken: "dummyRefreshToken",
  });
};
