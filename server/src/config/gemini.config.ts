import { ENV } from "./env.config.js"
import { GenerateContentConfig, GoogleGenAI, Type } from "@google/genai";
export const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export const trackExtractionContent = "Extract the song title and artist names visible in this image. Return only JSON matching the schema. Include as many full artist names as possible, but never include partial or truncated artist names. If text is unclear, ignore it. Set certainty from 0 to 1, where 1 means very clear and fully visible text, and lower values mean blur, cutoff, glare, or ambiguity.";
export const trackExtractionConfig: GenerateContentConfig = {
  responseMimeType: "application/json",
  responseJsonSchema: {
    type: Type.OBJECT,
    description: "Extract track metadata shown in the screenshot.",
    properties: {
      songTitle: {
        type: Type.STRING,
        description:
          "The exact song title visible in the image. Do not add extra text. Do not include words that are cut-off.",
      },
      songArtists: {
        type: Type.ARRAY,
        description: "List all fully visible artist names for this song. Include as many complete names as possible. Exclude any artist whose name is partially cut off, truncated, faded, or uncertain. Never return partial fragments such as 'Ta' or 'Dr'. Return an empty array if no full artist names are clearly visible.",
        items: {
          type: Type.STRING,
          description:
            "One complete artist name exactly as shown. It must be fully readable and never partial or truncated.",
        },
      },
      certainty: {
        type: Type.NUMBER,
        description:
          "Confidence score from 0 to 1 for the extracted metadata. Use low values when text is blurry, cut off, obstructed, or ambiguous.",
      },
    },
    propertyOrdering: ["songTitle", "songArtists", "certainty"],
    required: ["songTitle", "songArtists", "certainty"],
  },
};