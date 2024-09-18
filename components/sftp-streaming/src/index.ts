import {
  action,
  component,
  connection,
  ConnectionError,
  input,
  util,
} from "@prismatic-io/spectral";
import axios from "axios";
import Client from "ssh2-sftp-client";

export const basic = connection({
  key: "basic",
  label: "Basic Username/Password",
  comments: "Basic Username and Password connection",
  inputs: {
    username: { label: "Username", type: "string", required: true },
    password: { label: "Password", type: "password", required: true },
    host: { label: "Host", type: "string", required: true },
    port: { label: "Port", type: "string", default: "22", required: true },
  },
});

const uploadFileFromUrl = action({
  display: {
    label: "Upload file from URL",
    description: "Upload a file from a URL to an SFTP server",
  },
  inputs: {
    connection: input({
      label: "Connection",
      type: "connection",
      required: true,
    }),
    sourceUrl: input({
      label: "Source File URL",
      type: "string",
      clean: util.types.toString,
      required: true,
      example: "https://files.example.com/my-file.pdf",
    }),
    sftpPath: input({
      label: "Destination File Path",
      type: "string",
      clean: util.types.toString,
      required: true,
      example: "/path/to/my-file.pdf",
    }),
  },
  perform: async (context, params) => {
    const sftpClient = new Client();

    const { username, password, host, port, timeout } =
      params.connection.fields;

    try {
      await sftpClient.connect({
        username: util.types.toString(username),
        password: util.types.toString(password),
        host: util.types.toString(host),
        port: util.types.toInt(port),
        readyTimeout: util.types.toInt(timeout) || 3000,
      });
    } catch (err) {
      throw new ConnectionError(
        params.connection,
        `Unable to connect to SFTP server. ${err}`
      );
    }

    const source = await axios.get(params.sourceUrl, {
      responseType: "stream",
    });

    try {
      const result = await sftpClient.put(source.data, params.sftpPath);
      return { data: result };
    } finally {
      await sftpClient.end();
    }
  },
});

export default component({
  key: "sftp-streaming-example",
  public: false,
  display: {
    label: "sftp-streaming-example",
    description: "SFTP Streaming Example",
    iconPath: "icon.png",
  },
  actions: { uploadFileFromUrl },
  connections: [basic],
});
