import { describe, expect, test } from 'vitest'
import { getSpotifyTrack } from './spotify.provider'

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

describe('getSpotifyTrack Real Tests', () => {
	test('gets correct song when title and all artists match', async () => {
		const result = await getSpotifyTrack('Numb/Encore', ['Jay-Z', 'Linkin Park']);
		const normalizedArtists = result.songArtists.map(normalizeForAssertion);

		expect(result.songTitle.toLowerCase()).toContain('numb');
		expect(normalizedArtists).toEqual(
			expect.arrayContaining(['jay-z', 'linkin park'])
		);
		expect(result.spotifyUri).toMatch(/^spotify:track:/);
	});

	test('gets correct song when title and one artist matches a two-artist track', async () => {
		const result = await getSpotifyTrack('Numb/Encore', ['Linkin Park']);

		expect(result.songTitle.toLowerCase()).toContain('numb');
		expect(result.songArtists.map(normalizeForAssertion)).toContain('linkin park');
		expect(result.spotifyUri).toMatch(/^spotify:track:/);
	});

	test('throws when title does not exist', async () => {
		const improbableTitle = `not-a-real-song-${Date.now()}-xyz`;

		await expect(getSpotifyTrack(improbableTitle)).rejects.toThrow(
			`No Spotify track found for \"${improbableTitle}\".`
		);
	});

	test('trims surrounding whitespace in title and artist input', async () => {
		const result = await getSpotifyTrack('  Bohemian Rhapsody  ', ['  Queen  ']);

		expect(result.songTitle.toLowerCase()).toContain('bohemian rhapsody');
		expect(result.songArtists.map((artist) => artist.toLowerCase())).toContain('queen');
	});
});
