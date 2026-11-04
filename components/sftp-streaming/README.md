# SFTP Streaming

This example custom component shows how to [handle large files](https://prismatic.io/docs/custom-connectors/handling-large-files-in-custom-components/) without loading them fully into memory.
It has a single action, **Upload file from URL**, that downloads a file over HTTP and streams it directly to an SFTP server using [ssh2-sftp-client](https://www.npmjs.com/package/ssh2-sftp-client).

Because the download is piped straight to the upload, memory usage stays flat regardless of file size.

## Usage

```bash
npm install
npm run build     # Build the component into dist/
npm test          # Run unit tests
npm run publish   # Build and publish with Prism
```

After publishing, add the `sftp-streaming-example` component to an integration and configure a **Basic Username/Password** connection with your SFTP host, port, username and password.
