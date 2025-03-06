import Client from "ssh2-sftp-client";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { basic, privateKey } from "./connections";
import {
  secureCipherAlgorithms,
  secureServerHostKeyAlgorithms,
  unsecureCipherAlgorithms,
  unsecureServerHostKeyAlgorithms,
} from "./constants";

import type { CipherAlgorithm, ServerHostKeyAlgorithm } from "ssh2";

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
        "Unknown Connection type provided.",
      );
  }
};

export const getSftpClient = async (connection: Connection, debug: boolean) => {
  const sftp = new Client();

  sftp.on(
    "keyboard-interactive",
    function (_name, _instructions, _instructionsLang, _prompts, finish) {
      if (debug) {
        console.debug(
          "This SFTP server requires keyboard-interactive login. Falling back to keyboard-interactive.",
        );
      }
      finish([connection.fields.password]);
    },
  );

  const {
    host,
    port,
    timeout,
    enableUnsecureCiphers,
    enableUnsecureServerHostKeyAlgorithms,
    customServerHostKeyAlgorithms,
    customCiphers,
  } = connection.fields;

  try {
    let cipher = util.types.toBool(enableUnsecureCiphers)
      ? [...secureCipherAlgorithms, ...unsecureCipherAlgorithms]
      : secureCipherAlgorithms;

    let serverHostKey = util.types.toBool(enableUnsecureServerHostKeyAlgorithms)
      ? [...secureServerHostKeyAlgorithms, ...unsecureServerHostKeyAlgorithms]
      : secureServerHostKeyAlgorithms;

    const customServerHostKeyAlgorithmsString = util.types.toString(
      customServerHostKeyAlgorithms,
    );

    if (customServerHostKeyAlgorithmsString) {
      serverHostKey = customServerHostKeyAlgorithmsString
        .replace(/\s+/g, "")
        .split(",") as ServerHostKeyAlgorithm[];
    }

    const customCiphersString = util.types.toString(customCiphers);

    if (customCiphersString) {
      cipher = customCiphersString
        .replace(/\s+/g, "")
        .split(",") as CipherAlgorithm[];
    }

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
        serverHostKey,
        cipher,
      },
      ...getAuthParams(connection),
    });
  } catch (err) {
    throw new ConnectionError(
      connection,
      `Unable to connect to SFTP server. ${err}`,
    );
  }

  return sftp;
};
