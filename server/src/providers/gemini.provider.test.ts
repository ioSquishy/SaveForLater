import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getTrackFromBase64 } from "./gemini.provider";
import Mime from "../types/mime";
import { ai } from "../config/gemini.config";
import Track from '../types/track';

// mock ai object to prevent calling actual api
vi.mock('../config/gemini.config', async (importOriginal) => {
  // 1. Grab everything that is ACTUALLY in the file
  const actual = await importOriginal<typeof import('../config/gemini.config')>();
  
  return {
    ...actual, // 2. Keep the real trackExtractionContent, trackExtractionConfig, etc.
    ai: {      // 3. Only override the 'ai' export with our mock
      models: {
        generateContent: vi.fn(),
      },
    },
  };
});

describe('getTrackFromBase64 Mock Tests', () => {
  const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  const mockMime = Mime.JPEG;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('valid data', async () => {
    const mockTrack : Track = { songTitle: 'Super', songArtists: [ 'SEVENTEEN' ] };
    
    // Setup the mock to return a successful response
    (ai.models.generateContent as any).mockResolvedValue({
      text: JSON.stringify(mockTrack),
    });

    const result = await getTrackFromBase64(mockBase64, mockMime);

    expect(result).toEqual(mockTrack);
    expect(ai.models.generateContent).toHaveBeenCalledTimes(1);
  });

  test('empty response', async () => {
    (ai.models.generateContent as any).mockResolvedValue({
      text: '', // Empty string
    });

    await expect(getTrackFromBase64(mockBase64, mockMime))
      .rejects.toThrow('Gemini returned an empty response.');
  });

  test('invalid JSON', async () => {
    (ai.models.generateContent as any).mockResolvedValue({
      text: 'not-json-at-all',
    });

    await expect(getTrackFromBase64(mockBase64, mockMime))
      .rejects.toThrow('Gemini returned invalid JSON.');
  });

  test('invalid Track schema', async () => {
    // Return JSON that is valid, but missing the correct fields
    (ai.models.generateContent as any).mockResolvedValue({
      text: JSON.stringify({ something: 'else' }),
    });

    await expect(getTrackFromBase64(mockBase64, mockMime))
      .rejects.toThrow('Gemini response did not match Track format.');
  });
});