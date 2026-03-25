import express from 'express';
import ValidateRequest from './middleware/validateSchema';
import ProcessImageRequestSchema from '../types/route_schemas/search.image';
import { getSpotifyTrackFromDetails, getSpotifyTrackFromImage } from '../services/track.service';
import SpotifyTrack from '../types/SpotifyTrack';
import SearchSongQuerySchema from '../types/route_schemas/search.details';
const searchRouter = express.Router();


// get track by image
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

/**
 * Get track(s) by name + artist
 * 
 * Example queries:
 * - /search?songTitle=Super
 * - /search?songTitle=kiss me blue&artists=pami
 * - /search?songTitle=More Than Ever&artists=Andrea&artists=Jackson
 */
searchRouter.get("/details", ValidateRequest(SearchSongQuerySchema), async (req, res) => {
  const {
    query: { songTitle, artists, limit },
  } = SearchSongQuerySchema.parse({ query: req.query });

  let result: SpotifyTrack[];
  try {
    result = await getSpotifyTrackFromDetails(songTitle, artists, limit || 10);
  } catch (error) {
    return res.status(500).json({
      status: "Failed to get track",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
  return res.status(200).json(result);
});

export default searchRouter;