import { action } from "@prismatic-io/spectral";
import { minimatch } from "minimatch";
import {
  connection,
  path,
  pattern,
  includeSubdirectories,
  includeDirectories,
} from "./inputs";
import { getSftpClient } from "./client";

const listDirectory = action({
  display: {
    label: "List Directory",
    description:
      "List files and directories in a directory on an SFTP server. Optionally list files in subdirectories.",
  },
  perform: async (
    context,
    { connection, path, pattern, includeSubdirectories, includeDirectories },
  ) => {
    const sftp = await getSftpClient(connection, context.debug.enabled);

    try {
      const listDirectoryFilesRecursive = async (
        currentPath: string,
      ): Promise<string[]> => {
        const fileList = await sftp.list(currentPath, (file) =>
          pattern ? minimatch(file.name, pattern) : true,
        );

        const results: string[] = [];

        for (const file of fileList) {
          const fullPath = `${currentPath}/${file.name}`.replace(/\/+/g, "/");
          if (file.type === "d") {
            if (includeDirectories) {
              results.push(fullPath);
            }
            const subDirFiles = await listDirectoryFilesRecursive(fullPath);
            results.push(...subDirFiles);
          } else {
            results.push(fullPath);
          }
        }

        return results.sort();
      };

      const listDirectoryFiles = async (
        currentPath: string,
      ): Promise<string[]> => {
        const fileList = await sftp.list(currentPath, (file) =>
          pattern ? minimatch(file.name, pattern) : true,
        );

        return fileList
          .filter(({ type }) => (includeDirectories ? true : type !== "d"))
          .map(({ name }) => name)
          .sort();
      };

      const allFiles = includeSubdirectories
        ? await listDirectoryFilesRecursive(path)
        : await listDirectoryFiles(path);

      return {
        data: allFiles,
      };
    } finally {
      await sftp.end();
    }
  },
  inputs: {
    connection,
    path,
    pattern,
    includeSubdirectories,
    includeDirectories,
  },
  examplePayload: {
    data: ["folder1/file.txt", "folder1/subfolder/example.txt", "root.txt"],
  },
});

export default listDirectory;
