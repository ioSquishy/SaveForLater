import { describe, expect, test } from 'vitest'
import { getSpotifyTracks } from './spotify.provider'

/**
 * Normalizes accented characters and sets to lowercase
 * Example: "Jaÿ-Z" becomes "jay-z"
 * @param value any string
 * @returns normalized version
 */
function normalizeForAssertion(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

describe('getSpotifyTracks Real Tests', () => {
	test('gets correct song when title and all artists match', async () => {
		const results = await getSpotifyTracks('Numb/Encore', ['Jay-Z', 'Linkin Park']);
		const bestResult = results[0];
		const normalizedArtists = bestResult.songArtists.map(normalizeForAssertion);

		expect(results.length).toBeGreaterThan(0);
		expect(bestResult.songTitle.toLowerCase()).toContain('numb');
		expect(normalizedArtists).toEqual(
			expect.arrayContaining(['jay-z', 'linkin park'])
		);
		expect(bestResult.spotifyUri).toMatch(/^spotify:track:/);
	}, 30000);

	test('gets correct song when title and one artist matches a two-artist track', async () => {
		const results = await getSpotifyTracks('Numb/Encore', ['Linkin Park']);
		const bestResult = results[0];

		expect(results.length).toBeGreaterThan(0);
		expect(bestResult.songTitle.toLowerCase()).toContain('numb');
		expect(bestResult.songArtists.map(normalizeForAssertion)).toContain('linkin park');
		expect(bestResult.spotifyUri).toMatch(/^spotify:track:/);
	}, 30000);

	test('respects result size limit', async () => {
		const results = await getSpotifyTracks('Numb/Encore', ['Jay-Z', 'Linkin Park'], 1);

		expect(results).toHaveLength(1);
		expect(results[0].spotifyUri).toMatch(/^spotify:track:/);
	}, 30000);

	test('throws when title does not exist', async () => {
		const improbableTitle = `not-a-real-song-${Date.now()}-xyz`;

		await expect(getSpotifyTracks(improbableTitle)).rejects.toThrow(
			`No Spotify track found for \"${improbableTitle}\".`
		);
	}, 30000);

	test('trims surrounding whitespace in title and artist input', async () => {
		const results = await getSpotifyTracks('  Bohemian Rhapsody  ', ['  Queen  ']);
		const bestResult = results[0];

		expect(bestResult.songTitle.toLowerCase()).toContain('bohemian rhapsody');
		expect(bestResult.songArtists.map((artist) => artist.toLowerCase())).toContain('queen');
	}, 30000);
});
