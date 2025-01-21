import Client from "ssh2-sftp-client";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { basic, privateKey } from "./connections";
import {
  secureCipherAlgorithms,
  serverHostKeyAlgorithms,
  unsecureCipherAlgorithms,
} from "./constants";

export const getAuthParams = (connection: Connection) => {
  switch (connection.key) {
    case basic.key:
      return {
        username: util.types.toString(connection.fields.username),
        password: util.types.toString(connection.fields.password),
      };
    case privateKey.key:
      return {
        username: util.types.toString(connection.fields.username),
        privateKey: util.types.toString(connection.fields.privateKey),
        passphrase: util.types.toString(connection.fields.passphrase),
        password: util.types.toString(connection.fields.password),
      };
    default:
      throw new ConnectionError(
        connection,
        "Unknown Connection type provided."
      );
  }
};

export const getSftpClient = async (connection: Connection, debug: boolean) => {
  const sftp = new Client();

  sftp.on("keyboard-interactive", function (
    _name,
    _instructions,
    _instructionsLang,
    _prompts,
    finish
  ) {
    if (debug) {
      console.debug(
        "This SFTP server requires keyboard-interactive login. Falling back to keyboard-interactive."
      );
    }
    finish([connection.fields.password]);
  });

  const { host, port, timeout, enableUnsecureCiphers } = connection.fields;

  try {
    const cipher = util.types.toBool(enableUnsecureCiphers)
      ? [...secureCipherAlgorithms, ...unsecureCipherAlgorithms]
      : secureCipherAlgorithms;
    await sftp.connect({
      host: util.types.toString(host),
      port: util.types.toInt(port),
      readyTimeout: util.types.toInt(timeout) || 3000,
      tryKeyboard: true,
      debug: (msg) => {
        if (debug) {
          console.debug(msg);
        }
      },
      algorithms: {
        serverHostKey: serverHostKeyAlgorithms,
        cipher,
      },
      ...getAuthParams(connection),
    });
  } catch (err) {
    throw new ConnectionError(
      connection,
      `Unable to connect to SFTP server. ${err}`
    );
  }

  return sftp;
};
