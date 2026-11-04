import { configPage, configVar } from "@prismatic-io/spectral";
import { dropboxOauth } from "./manifests/dropbox/connections/oauth";

export const configPages = {
  Connections: configPage({
    elements: {
      // Dropbox app key and secret are read from .env at build time (see .env.example).
      // For production use, consider a customer-activated connection instead:
      // https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/
      "Dropbox Connection": dropboxOauth("dropbox-connection", {
        clientId: { value: process.env.DROPBOX_CLIENT_ID ?? "" },
        clientSecret: {
          value: process.env.DROPBOX_CLIENT_SECRET ?? "",
          writeOnly: true,
        },
      }),
    },
  }),
  "Transfer Settings": configPage({
    elements: {
      "Source Folder": configVar({
        stableKey: "source-folder",
        dataType: "string",
        description: "Dropbox folder to pick files up from.",
        defaultValue: "/Large File Transfer/source",
      }),
      "Destination Folder": configVar({
        stableKey: "destination-folder",
        dataType: "string",
        description: "Dropbox folder the copy is written to.",
        defaultValue: "/Large File Transfer/destination",
      }),
      "Archive Folder": configVar({
        stableKey: "archive-folder",
        dataType: "string",
        description:
          "Dropbox folder the original is moved to after a verified copy.",
        defaultValue: "/Large File Transfer/archive",
      }),
      "Chunk Size (MB)": configVar({
        stableKey: "chunk-size-mb",
        dataType: "string",
        description:
          "Bytes transferred per batch execution. Rounded down to a multiple of 4 MB and capped at 148 MB, the largest 4 MB multiple under Dropbox's 150 MB per-request limit. Larger chunks mean fewer batches and more memory per execution.",
        defaultValue: "40",
      }),
    },
  }),
};
