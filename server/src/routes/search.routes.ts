import express from 'express';
import ValidateRequest from './middleware/validateSchema';
import ProcessImageRequestSchema from '../types/route_schemas/search.image';
import { getSpotifyTrackFromImage } from '../services/track.service';
import SpotifyTrack from '../types/SpotifyTrack';
const searchRouter = express.Router();


// get track(s) by image
searchRouter.post("/image", ValidateRequest(ProcessImageRequestSchema), async (req, res) => {
  const { base64Image, mimeType } = req.body;
  let result: SpotifyTrack;
  try {
    result = await getSpotifyTrackFromImage(base64Image, mimeType);
  } catch (error) {
    return res.status(500).json({
      status: "Failed to get track",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
  return res.status(200).json(result);
});


// get track(s) by name + artist
searchRouter.get("/details", async (req, res) => {
  
});

export default searchRouter;