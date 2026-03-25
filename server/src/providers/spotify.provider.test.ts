import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getSpotifyTracks } from './spotify.provider'
import spotifySdk from '../config/spotify.config'

vi.mock('../config/spotify.config', () => ({
	default: {
		search: vi.fn(),
	},
}));

describe('getSpotifyTracks Mock Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	});

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

	test('returns tracks array when no artists are provided', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [
					makeTrack('Song A', ['Artist A'], 'spotify:track:1'),
					makeTrack('Song B', ['Artist B'], 'spotify:track:2'),
				],
			},
		});

		const result = await getSpotifyTracks('Song A');

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			songTitle: 'Song A',
			songArtists: ['Artist A'],
			spotifyUri: 'spotify:track:1',
			albumImgUri: 'https://img.test/cover.jpg',
		});
		expect(result[1].spotifyUri).toBe('spotify:track:2');
    expect(spotifySdk.search).toHaveBeenCalledTimes(1);
	});

	test('prioritizes artist-matching tracks first', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [
					makeTrack('Super', ['Wrong Artist'], 'spotify:track:wrong'),
					makeTrack('Super', ['SEVENTEEN'], 'spotify:track:right'),
				],
			},
		});

		const result = await getSpotifyTracks('Super', ['SEVENTEEN']);

		expect(result[0].spotifyUri).toBe('spotify:track:right');
		expect(result[0].songArtists).toEqual(['SEVENTEEN']);
		expect(result[1].spotifyUri).toBe('spotify:track:wrong');
    expect(spotifySdk.search).toHaveBeenCalledTimes(1);
	});

	test('returns only up to provided limit size', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [
					makeTrack('Song 1', ['Artist 1'], 'spotify:track:1'),
					makeTrack('Song 2', ['Artist 2'], 'spotify:track:2'),
					makeTrack('Song 3', ['Artist 3'], 'spotify:track:3'),
				],
			},
		});

		const result = await getSpotifyTracks('Song', undefined, 2);

		expect(result).toHaveLength(2);
		expect(result.map((track) => track.spotifyUri)).toEqual([
			'spotify:track:1',
			'spotify:track:2',
		]);
	});

	test('uses minimum search limit of 5 but still returns requested number of results', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [
					makeTrack('Song 1', ['Artist 1'], 'spotify:track:1'),
					makeTrack('Song 2', ['Artist 2'], 'spotify:track:2'),
					makeTrack('Song 3', ['Artist 3'], 'spotify:track:3'),
				],
			},
		});

		const result = await getSpotifyTracks('Song', undefined, 2);

		expect(spotifySdk.search).toHaveBeenCalledWith(
			'track:Song',
			['track'],
			undefined,
			5
		);
		expect(result).toHaveLength(2);
	});

	test('throws for empty song title', async () => {
		await expect(getSpotifyTracks('   ')).rejects.toThrow('Song title cannot be empty.');
		expect(spotifySdk.search).not.toHaveBeenCalled();
	});

	test('throws when spotify returns no matches', async () => {
		(spotifySdk.search as any).mockResolvedValue({
			tracks: {
				items: [],
			},
		});

		await expect(getSpotifyTracks('Unknown Song'))
      .rejects.toThrow('No Spotify track found for "Unknown Song".');
	});

	test('throws when limit is out of range', async () => {
		await expect(getSpotifyTracks('Song', undefined, 0)).rejects.toThrow(
			'limit must be an integer between [1-50]'
		);
		expect(spotifySdk.search).not.toHaveBeenCalled();
	});
});
