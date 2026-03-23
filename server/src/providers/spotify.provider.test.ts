import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getSpotifyTrack } from './spotify.provider'
import spotifySdk from '../config/spotify.config'

vi.mock('../config/spotify.config', () => ({
	default: {
		search: vi.fn(),
	},
}))

describe('getSpotifyTrack Mock Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	const makeTrack = (
		name: string,
		artists: string[],
		uri: string,
		imageUrl = 'https://img.test/cover.jpg'
	) => ({
		name,
		artists: artists.map((artist) => ({ name: artist })),
		uri,
		album: {
			images: [{ url: imageUrl }],
		},
	});

	test('returns first result when no artists are provided', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [
					makeTrack('Song A', ['Artist A'], 'spotify:track:1'),
					makeTrack('Song B', ['Artist B'], 'spotify:track:2'),
				],
			},
		});

		const result = await getSpotifyTrack('Song A');

		expect(result).toEqual({
			songTitle: 'Song A',
			songArtists: ['Artist A'],
			spotifyUri: 'spotify:track:1',
			albumImgUri: 'https://img.test/cover.jpg',
		});
    expect(spotifySdk.search).toHaveBeenCalledTimes(1);
	});

	test('prioritizes artist-matching track over non-matching track', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [
					makeTrack('Super', ['Wrong Artist'], 'spotify:track:wrong'),
					makeTrack('Super', ['SEVENTEEN'], 'spotify:track:right'),
				],
			},
		});

		const result = await getSpotifyTrack('Super', ['SEVENTEEN']);

		expect(result.spotifyUri).toBe('spotify:track:right');
		expect(result.songArtists).toEqual(['SEVENTEEN']);
    expect(spotifySdk.search).toHaveBeenCalledTimes(1);
	});

	test('throws for empty song title', async () => {
		await expect(getSpotifyTrack('   ')).rejects.toThrow('Song title cannot be empty.');
		expect(spotifySdk.search).not.toHaveBeenCalled();
	});

	test('throws when spotify returns no matches', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [],
			},
		});

		await expect(getSpotifyTrack('Unknown Song'))
      .rejects.toThrow('No Spotify track found for "Unknown Song".');
	});
});
