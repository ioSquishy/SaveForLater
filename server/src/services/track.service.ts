import { getScannedTrackFromBase64 } from "../providers/gemini.provider";
import { getSpotifyTrack } from "../providers/spotify.provider";
import Mime from "../types/mime";
import SpotifyTrack from "../types/SpotifyTrack";

export async function getSpotifyTrackFromImage(base64ImageEncoding: string, mimeType: Mime): Promise<SpotifyTrack> {
  try {
    let scannedTrack = await getScannedTrackFromBase64(base64ImageEncoding, mimeType);
    if (scannedTrack.certainty < 0.5) {
      throw new Error("Track extraction certainty is too low.");
    }

    return await getSpotifyTrack(scannedTrack.songTitle, scannedTrack.songArtists);
  } catch (error) {
    throw error || "Failed to get Spotify track from Image.";
  }
}


export async function getSpotifyTrackFromDetails(songTitle: string, songArtists?: string[]): Promise<SpotifyTrack> {
  return await getSpotifyTrack(songTitle, songArtists);
}