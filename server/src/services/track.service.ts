import { MaxInt } from "@spotify/web-api-ts-sdk";
import { getScannedTrackFromBase64 } from "../providers/gemini.provider";
import { getSpotifyTracks } from "../providers/spotify.provider";
import Mime from "../types/Mime";
import SpotifyTrack from "../types/SpotifyTrack";

export async function getSpotifyTrackFromImage(base64ImageEncoding: string, mimeType: Mime): Promise<SpotifyTrack> {
  let scannedTrack = await getScannedTrackFromBase64(base64ImageEncoding, mimeType);
  if (scannedTrack.certainty < 0.5) {
    throw new Error("Track extraction certainty is too low.");
  }
  return (await getSpotifyTracks(scannedTrack.songTitle, scannedTrack.songArtists, 1))[0];
}


export async function getSpotifyTrackFromDetails(songTitle: string, songArtists?: string[], limit?: number): Promise<SpotifyTrack[]> {
  return await getSpotifyTracks(songTitle, songArtists, limit);
}