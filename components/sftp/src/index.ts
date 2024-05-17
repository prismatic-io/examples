import { component } from "@prismatic-io/spectral";
import readActions from "./readActions";
import writeFile from "./writeActions";
import moveFile from "./moveActions";
import deleteFile from "./deleteActions";
import listDirectory from "./listActions";
import connections from "./connections";
import createActions from "./createActions";

export default component({
  key: "sftp",
  documentationUrl: "https://prismatic.io/docs/components/sftp/",
  public: true,
  display: {
    label: "SFTP",
    description: "Read, write, move and delete files on an SFTP server",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  actions: {
    ...readActions,
    ...createActions,
    writeFile,
    moveFile,
    deleteFile,
    listDirectory,
  },
  connections,
});
