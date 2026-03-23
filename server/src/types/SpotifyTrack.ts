import { z } from "zod";

export const spotifyTrackSchema = z.object({
  songTitle: z.string(),
  songArtists: z.array(z.string()),
  spotifyUri: z.string(),
  albumImgUri: z.string().optional(),
});

export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>;

export default SpotifyTrack;