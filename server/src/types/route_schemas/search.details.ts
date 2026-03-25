import { z } from 'zod';

const SearchSongQuerySchema = z.object({
  query: z.object({
    songTitle: z.string().min(1, "Song title is required"),
    
    // 1. Accept either a single string OR an array of strings
    // 2. Make the whole thing optional
    // 3. Transform whatever we get into a guaranteed array
    artists: z.union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined; // Keep it optional
        // If it's already an array, return it. If it's a single string, wrap it in an array.
        return Array.isArray(val) ? val : [val]; 
      }),
    
    limit: z.coerce.number().int().positive().min(1).max(50).optional(),
  })
});

export default SearchSongQuerySchema;