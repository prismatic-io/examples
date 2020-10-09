import Jimp from "jimp/es";
import assert from "assert";
import { action, component, input } from "@prismatic-io/spectral";
import { version } from "../package.json";

const fontUrl =
  "https://unpkg.com/jimp@0.16.1/fonts/open-sans/open-sans-16-white/open-sans-16-white.fnt";

const imageInput = input({
  key: "image",
  label: "Image Data",
  type: "data",
  required: true,
  comments: "A data buffer for an open image file",
});

export const timestampAction = action({
  key: "timestampImage",
  display: {
    label: "Timestamp Image",
    description: "Add a timestamp to an image",
  },
  perform: async (context, { image }) => {
    assert(image.contentType.startsWith("image/"));
    const jimpInstance = await Jimp.read(image.data);
    const font = await Jimp.loadFont(fontUrl);
    const timestamp = new Date();
    jimpInstance.print(font, 0, 0, timestamp.toISOString());
    const imageWithTimestamp = await jimpInstance.getBufferAsync(Jimp.MIME_PNG);
    return {
      data: imageWithTimestamp,
      contentType: Jimp.MIME_PNG,
    };
  },
  inputs: [imageInput],
});

export default component({
  key: "image-timestamper",
  public: false,
  version,
  display: {
    label: "Image Timestamper",
    description: "Adds a timestamp to an image",
    iconPath: "icon.png",
  },
  actions: {
    ...timestampAction,
  },
});
