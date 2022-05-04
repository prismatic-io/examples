interface SlackError {
  data: { ok: boolean; error: string };
  code: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleErrors = async (response: Promise<any>): Promise<any> => {
  try {
    const result = await response;

    return result?.data;
  } catch (e) {
    const error = e as SlackError;
    throw new Error(JSON.stringify(error));
  }
};
