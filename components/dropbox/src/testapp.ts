import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "isomorphic-fetch";

// FIXME: This doesn't seem proper.
// See https://github.com/dropbox/dropbox-sdk-js/issues/201
//import { Dropbox } from "dropbox";
import { Dropbox } from "dropbox/dist/Dropbox-sdk.min";

dotenv.config();

// Server config.
const app = express();
const port = process.env.PORT;
app.set("port", port);
app.use(bodyParser.json());
app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});

// Client config.
const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch: fetch,
});

const link = (path: string) => {
  return `http://localhost:${port}/${path}/`;
};

// Routes.
app.get("/", (req, res) => {
  res.send(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head></head>
      <body>
        <h1>Dropbox API</h1>
        <ul>
          <li><a href="${link("listFolder")}">List Folder</a></li>
          <li><a href="${link("createFolder")}">Create Folder</a></li>
          <li><a href="${link("moveObject")}">Move Object</a></li>
          <li><a href="${link("deleteObject")}">Delete Object</a></li>
          <li><a href="${link("copyObject")}">Copy Object</a></li>
          <li><a href="${link("downloadFile")}">Download File</a></li>
          <li><a href="${link("uploadFile")}">Upload File</a></li>
          <li><a href="${link("reuploadFile")}">Re-upload File</a></li>
        </ul>
      </body>
    </html>
    `
  );
});

app.get("/listFolder", async (req, res) => {
  let initial = true;
  let hasMore = false;
  let currentCursor;
  let allEntries = [];

  try {
    while (initial || hasMore) {
      let result;
      if (initial) {
        result = await dbx.filesListFolder({ path: "" });
      } else {
        result = await dbx.filesListFolderContinue({ cursor: currentCursor });
      }

      const { entries, has_more, cursor } = result;
      console.log(typeof allEntries, typeof entries);

      allEntries = allEntries.concat(entries);
      hasMore = has_more;
      currentCursor = cursor;
      initial = false;
    }

    res.send(allEntries);
  } catch (error) {
    res.send(error);
  }
});

app.get("/createFolder", async (req, res) => {
  try {
    const result = await dbx.filesCreateFolderV2({ path: "/Test" });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get("/moveObject", async (req, res) => {
  try {
    const result = await dbx.filesMoveV2({
      from_path: "/Test",
      to_path: "/Test2",
    });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get("/deleteObject", async (req, res) => {
  try {
    const result = await dbx.filesDeleteV2({
      path: "/Test",
    });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get("/copyObject", async (req, res) => {
  try {
    const result = await dbx.filesCopyV2({
      from_path: "/Test",
      to_path: "/Test2",
    });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get("/downloadFile", async (req, res) => {
  try {
    const result = await dbx.filesDownload({
      path: "/input.json",
    });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get("/uploadFile", async (req, res) => {
  try {
    const result = await dbx.filesUpload({
      path: "/upload.json",
      contents: JSON.stringify({ name: "John Doe", age: 35 }),
    });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.get("/reuploadFile", async (req, res) => {
  try {
    const downloadResult = await dbx.filesDownload({
      path: "/input.json",
    });
    console.log(downloadResult);

    const contents = Buffer.from(downloadResult["fileBinary"]);

    const uploadResult = await dbx.filesUpload({
      path: "/reupload.json",
      contents: contents,
    });
    res.send(uploadResult);
  } catch (error) {
    res.send(error);
  }
});
