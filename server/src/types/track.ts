import { z } from "zod";

export const trackSchema = z.object({
  songTitle: z.string(),
  songArtists: z.array(z.string()),
  certainty: z.number().min(0).max(1).optional(),
});

export type Track = z.infer<typeof trackSchema>;

export default Track;