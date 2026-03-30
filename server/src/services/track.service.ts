import { getScannedTrackFromBase64 } from "../providers/gemini.provider";
import { getSpotifyTracks } from "../providers/spotify.provider";
import HttpError from "../errors/HttpError";
import Mime from "../types/Mime";
import SpotifyTrack from "../types/SpotifyTrack";

export async function getSpotifyTrackFromImage(base64ImageEncoding: string, mimeType: Mime): Promise<SpotifyTrack> {
  let scannedTrack;
  try {
    scannedTrack = await getScannedTrackFromBase64(base64ImageEncoding, mimeType);
  } catch (error) {
    throw new HttpError(503, "Gemini service is unavailable.", "GEMINI_UNAVAILABLE", {
      reason: error instanceof Error ? error.message : "Unknown provider error",
    });
  }

  if (scannedTrack.certainty < 0.5) {
    throw new HttpError(422, "Track extraction certainty is too low.", "LOW_CONFIDENCE", {
      certainty: scannedTrack.certainty,
      threshold: 0.5,
    });
  }

  let tracks;
  try {
    tracks = await getSpotifyTracks(scannedTrack.songTitle, scannedTrack.songArtists, 1);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("No Spotify track found")) {
      throw new HttpError(404, "No matching Spotify track found.", "TRACK_NOT_FOUND");
    }

    throw new HttpError(503, "Spotify service is unavailable.", "SPOTIFY_UNAVAILABLE", {
      reason: error instanceof Error ? error.message : "Unknown provider error",
    });
  }

  if (!tracks.length) {
    throw new HttpError(404, "No matching Spotify track found.", "TRACK_NOT_FOUND");
  }

  return tracks[0];
}


export async function getSpotifyTrackFromDetails(songTitle: string, songArtists?: string[], limit?: number): Promise<SpotifyTrack[]> {
  try {
    return await getSpotifyTracks(songTitle, songArtists, limit);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("No Spotify track found")) {
      throw new HttpError(404, "No matching Spotify track found.", "TRACK_NOT_FOUND");
    }

    throw new HttpError(503, "Spotify service is unavailable.", "SPOTIFY_UNAVAILABLE", {
      reason: error instanceof Error ? error.message : "Unknown provider error",
    });
  }
}