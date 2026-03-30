import express from 'express';
import ValidateRequest from './middleware/validateSchema';
import ProcessImageRequestSchema from '../types/route_schemas/search.image';
import { getSpotifyTrackFromDetails, getSpotifyTrackFromImage } from '../services/track.service';
import SearchSongQuerySchema from '../types/route_schemas/search.details';
const searchRouter = express.Router();


/**
 * Get track by base64 image
 * 
 * Throws 422 if low confidence
 * Throws 404 if track not found
 * Throws 503 if provider unavailable
 */
searchRouter.post("/image", ValidateRequest(ProcessImageRequestSchema), async (req, res, next) => {
  const { base64Image, mimeType } = req.body;

  try {
    const result = await getSpotifyTrackFromImage(base64Image, mimeType);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get track(s) by name + artist
 * 
 * Example queries:
 * - /search?songTitle=Super
 * - /search?songTitle=kiss me blue&artists=pami
 * - /search?songTitle=More Than Ever&artists=Andrea&artists=Jackson
 * 
 * Throws 404 if track not found
 * Throws 503 if provider unavailable
 */
searchRouter.get("/details", ValidateRequest(SearchSongQuerySchema), async (req, res, next) => {
  const {
    query: { songTitle, artists, limit },
  } = SearchSongQuerySchema.parse({ query: req.query });

  try {
    const result = await getSpotifyTrackFromDetails(songTitle, artists, limit || 10);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

export default searchRouter;