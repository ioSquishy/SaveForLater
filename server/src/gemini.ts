import { ai, trackExtractionConfig, trackExtractionContent } from "./auth/gemini-auth.js";
import * as fs from "node:fs";

const base64ImageFile = fs.readFileSync("test/track_images/full.PNG", {
  encoding: "base64",
});

const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  {
    text: trackExtractionContent,
  },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: contents,
  config: trackExtractionConfig,
});
console.log(response.text);