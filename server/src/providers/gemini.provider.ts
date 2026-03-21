import { ai, trackExtractionConfig, trackExtractionContent } from "../config/gemini.config.js";
import Mime from "../types/mime.js";
import Track, { trackSchema } from "../types/track.js";

export async function getTrackFromBase64(base64ImageEncoding: string, mimeType: Mime) : Promise<Track> {
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
    const track = trackSchema.parse(parsed);
    return track;
  } catch (error) {
    throw error;
  }
}