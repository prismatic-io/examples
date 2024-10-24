import Client from "ssh2-sftp-client";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { basic, privateKey } from "./connections";

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

  const { host, port, timeout } = connection.fields;

  try {
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
        serverHostKey: [
          "ssh-ed25519",
          "ecdsa-sha2-nistp256",
          "ecdsa-sha2-nistp384",
          "ecdsa-sha2-nistp521",
          "rsa-sha2-512",
          "rsa-sha2-256",
          "ssh-rsa",
          "ssh-dss",
        ],
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
