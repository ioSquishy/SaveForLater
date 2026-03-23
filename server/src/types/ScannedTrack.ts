import { z } from "zod";

export const scannedTrackSchema = z.object({
  songTitle: z.string(),
  songArtists: z.array(z.string()),
  certainty: z.number().min(0).max(1),
});

export type ScannedTrack = z.infer<typeof scannedTrackSchema>;

export default ScannedTrack;