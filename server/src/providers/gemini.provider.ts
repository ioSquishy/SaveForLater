import { ai, trackExtractionConfig, trackExtractionContent } from "../config/gemini.config.js";
import Mime from "../types/mime.js";
import ScannedTrack, { scannedTrackSchema } from "../types/ScannedTrack.js";

export async function getScannedTrackFromBase64(base64ImageEncoding: string, mimeType: Mime) : Promise<ScannedTrack> {
  const contents = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageEncoding,
      },
    },
    {
      text: trackExtractionContent,
    },
  ];
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: trackExtractionConfig,
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  try {
    const track = scannedTrackSchema.parse(parsed);
    return track;
  } catch {
    throw new Error("Gemini response did not match Track format.");
  }
}