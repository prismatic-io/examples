import { ActionContext, util } from "@prismatic-io/spectral";
import { DropboxResponseError } from "dropbox";
import { StringTag } from "./types";

export const handleDropboxError = (err, paths = []) => {
  // https://developers.dropbox.com/error-handling-guide
  if (err instanceof DropboxResponseError) {
    switch (err.status) {
      case 401:
        throw new Error(
          `An error occurred with authorization. You may not have permissions to perform this task. Error: ${JSON.stringify(
            err
          )}`
        );
      case 409:
        throw new Error(
          `An error related to file paths occurred. You may be trying to create a directory that already exists, or you may be referencing a file or directory that does not exist. File paths: "${paths}". Error: ${JSON.stringify(
            err
          )}`
        );
      case 429:
        throw new Error(
          `Dropbox reports that your app has been rate-limited. Please slow the number of requests you are making. Error: ${JSON.stringify(
            err
          )}`
        );
      case 500:
        throw new Error(
          `An error occurred on Dropbox's side. Is the Dropbox API down? https://status.dropbox.com/ Error: ${JSON.stringify(
            err
          )}`
        );
    }
  }
  throw new Error(`An unknown error occurred. Error: ${JSON.stringify(err)}`);
};

export const validatePath = (path) => {
  if (!util.types.toString(path).startsWith("/")) {
    throw new Error(
      `Dropbox requires all file paths to start with a leading "/". The file path "${path}" does not start with a "/".`
    );
  }
};

export default { validatePath };

export const getHeadersRawRequest = (dropboxToken, httpClientInputs) => {
  const headers = {
    Authorization: `Bearer ${dropboxToken}`,
  };
  if (httpClientInputs.headers.length > 0) {
    let contentTypeHeader = null;
    httpClientInputs.headers.forEach((header) => {
      const headerName = header.key.toLowerCase();
      const headerValue = header.value;
      if (headerName === "content-type") {
        contentTypeHeader = headerValue;
      }
    });
    headers["Content-Type"] = contentTypeHeader || "";
  } else {
    headers["Content-Type"] = "";
  }
  return headers;
};

export const getUserTypeHeader = (userType, teamMemberId) => {
  const headers = {};
  if (userType === "user") {
    headers["Dropbox-API-Select-User"] = teamMemberId;
  } else if (userType === "admin") {
    headers["Dropbox-API-Select-Admin"] = teamMemberId;
  } else {
    throw new Error("Invalid user type. Must be 'user' or 'admin'.");
  }
  return headers;
};

export const cleanString = (value: unknown) =>
  util.types.toString(value).replace(/\/$/, "");

export const cleanActionArray = (value: unknown): StringTag[] => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => ({ ".tag": util.types.toString(item) }));
  }
  return undefined;
};

export const cleanStringWithTag = (value: unknown): StringTag => {
  if (value) {
    return { ".tag": util.types.toString(value) };
  }
  return undefined;
};

export const checkDebug = (params: any, context: ActionContext) => {
  if (params.debug) {
    const { debug, ...rest } = params;
    context.logger.debug("Params", rest);
  }
};

export const getEntries = (
  filePaths,
  dynamicPaths
): Array<{ path: string }> => {
  let entries = filePaths.map((path) => {
    validatePath(path);
    return { path };
  });

  if (dynamicPaths && Array.isArray(dynamicPaths)) {
    entries = entries.concat(
      dynamicPaths.map((path) => {
        validatePath(path);
        return { path };
      })
    );
  }
  return entries;
};
