import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import {
  googleOAuthConnection,
  googlePrivateKeyConnection,
} from "./connections";
import { GoogleAuth, OAuth2Client } from "google-auth-library";
import { StorageOptions } from "@google-cloud/storage";
import { xml2json, js2xml } from "xml-js";
import { PART_UPLOAD_ARRAY_ERROR } from "./constants";
import { Part } from "./interfaces";

export const getStorageOptions = (
  connection: Connection,
  isHttp = false
): StorageOptions => {
  if (connection.key === googleOAuthConnection.key) {
    if (!connection.token?.access_token) {
      throw new ConnectionError(
        connection,
        "Received valid OAuth Connection type but did not find valid access token."
      );
    }
    const oauth2Client = new OAuth2Client();
    const token = util.types.toString(connection.token.access_token);
    oauth2Client.setCredentials({
      access_token: token,
    });

    return {
      authClient: oauth2Client,
    };
  } else if (connection.key === googlePrivateKeyConnection.key) {
    const clientEmail = util.types.toString(connection.fields.clientEmail);
    const privateKey = util.types
      .toString(connection.fields.privateKey)
      .replace(/\\n/g, "\n");

    const googleAuth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/devstorage.read_write"],
    });

    if (isHttp) {
      return {
        authClient: googleAuth,
      };
    }
    return {
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    };
  }
  throw new ConnectionError(connection, "Unknown Connection type provided.");
};

export const validateConnection = (connection: Connection) => {
  if (
    ![googleOAuthConnection.key, googlePrivateKeyConnection.key].includes(
      connection.key
    )
  ) {
    throw new ConnectionError(connection, "Unknown Connection type provided.");
  }
};

export const getProjectId = (connection: Connection): string => {
  return util.types.toString(connection.fields.projectId);
};

export const convertXMLToJSON = (xml: string) => {
  return util.types.toObject(
    xml2json(xml, {
      compact: true,
      spaces: 0,
    })
  );
};

export const convertJSObjectToXML = (jsObjec: Record<string, unknown>) => {
  return js2xml(jsObjec, {
    compact: true,
    spaces: 2,
  });
};

export const cleanNumber = (value: unknown) =>
  value ? util.types.toNumber(value) : undefined;

export const cleanUploads = (value: unknown): Part[] => {
  const uploads = util.types.toObject(value);
  if (Array.isArray(uploads)) {
    uploads.forEach((upload) => {
      const keys = Object.keys(upload);
      if (
        keys.length === 2 &&
        keys.includes("PartNumber") &&
        keys.includes("ETag")
      ) {
        return;
      }
      throw new Error(PART_UPLOAD_ARRAY_ERROR);
    });
    return uploads;
  }
  throw new Error(PART_UPLOAD_ARRAY_ERROR);
};
