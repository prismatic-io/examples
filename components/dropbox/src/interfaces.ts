import { files } from "dropbox";

export type DropboxEntry =
  | files.FileMetadataReference
  | files.FolderMetadataReference
  | files.DeletedMetadataReference;
