import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getSpotifyTrackFromDetails, getSpotifyTrackFromImage } from './track.service'
import Mime from '../types/Mime'
import type ScannedTrack from '../types/ScannedTrack'
import type SpotifyTrack from '../types/SpotifyTrack'
import { getScannedTrackFromBase64 } from '../providers/gemini.provider'
import { getSpotifyTracks } from '../providers/spotify.provider'

vi.mock('../providers/gemini.provider', () => ({
	getScannedTrackFromBase64: vi.fn(),
}));

vi.mock('../providers/spotify.provider', () => ({
	getSpotifyTracks: vi.fn(),
}));

describe('track.service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	});

	test('getSpotifyTrackFromImage returns first Spotify track when extraction certainty is high', async () => {
		const scannedTrack: ScannedTrack = {
			songTitle: 'Numb/Encore',
			songArtists: ['Jay-Z', 'Linkin Park'],
			certainty: 0.9,
		};

		const spotifyTrack: SpotifyTrack = {
			songTitle: 'Numb/Encore',
			songArtists: ['JAY-Z', 'Linkin Park'],
			spotifyUri: 'spotify:track:dummy',
			albumImgUri: 'https://img.test/numb-encore.jpg',
		};

		(getScannedTrackFromBase64 as any).mockResolvedValue(scannedTrack);
		(getSpotifyTracks as any).mockResolvedValue([spotifyTrack]);

		const result = await getSpotifyTrackFromImage('base64-data', Mime.JPEG);

		expect(result).toEqual(spotifyTrack);
		expect(getSpotifyTracks).toHaveBeenCalledWith('Numb/Encore', ['Jay-Z', 'Linkin Park'], 1);
	});

	test('getSpotifyTrackFromImage selects the top-ranked track from provider results', async () => {
		(getScannedTrackFromBase64 as any).mockResolvedValue({
			songTitle: 'Super',
			songArtists: ['SEVENTEEN'],
			certainty: 0.9,
		} as ScannedTrack);

		(getSpotifyTracks as any).mockResolvedValue([
			{
				songTitle: 'Super',
				songArtists: ['SEVENTEEN'],
				spotifyUri: 'spotify:track:top',
			},
			{
				songTitle: 'Super',
				songArtists: ['Wrong Artist'],
				spotifyUri: 'spotify:track:second',
			},
		]);

		const result = await getSpotifyTrackFromImage('base64-data', Mime.JPEG);

		expect(result.spotifyUri).toBe('spotify:track:top');
	});

	test('getSpotifyTrackFromImage throws when extraction certainty is too low', async () => {
		(getScannedTrackFromBase64 as any).mockResolvedValue({
			songTitle: 'Any Song',
			songArtists: ['Any Artist'],
			certainty: 0.49,
		} as ScannedTrack);

		await expect(getSpotifyTrackFromImage('base64-data', Mime.PNG)).rejects.toThrow(
			'Track extraction certainty is too low.'
		);
		expect(getSpotifyTracks).not.toHaveBeenCalled();
	});

	test('getSpotifyTrackFromImage maps Gemini provider errors to 503', async () => {
		(getScannedTrackFromBase64 as any).mockRejectedValue(new Error('Gemini unavailable'));

		await expect(getSpotifyTrackFromImage('base64-data', Mime.WEBP)).rejects.toMatchObject({
			statusCode: 503,
			message: 'Gemini service is unavailable.',
			code: 'GEMINI_UNAVAILABLE',
		});
		expect(getSpotifyTracks).not.toHaveBeenCalled();
	});

	test('getSpotifyTrackFromImage maps Spotify provider errors to 503', async () => {
		(getScannedTrackFromBase64 as any).mockResolvedValue({
			songTitle: 'Numb/Encore',
			songArtists: ['Jay-Z', 'Linkin Park'],
			certainty: 0.8,
		} as ScannedTrack);
		(getSpotifyTracks as any).mockRejectedValue(new Error('Spotify unavailable'));

		await expect(getSpotifyTrackFromImage('base64-data', Mime.JPEG)).rejects.toMatchObject({
			statusCode: 503,
			message: 'Spotify service is unavailable.',
			code: 'SPOTIFY_UNAVAILABLE',
		});
	});

	test('getSpotifyTrackFromImage maps provider not-found errors to 404', async () => {
		(getScannedTrackFromBase64 as any).mockResolvedValue({
			songTitle: 'Not Real',
			songArtists: ['Nobody'],
			certainty: 0.9,
		} as ScannedTrack);
		(getSpotifyTracks as any).mockRejectedValue(new Error('No Spotify track found for "Not Real".'));

		await expect(getSpotifyTrackFromImage('base64-data', Mime.JPEG)).rejects.toMatchObject({
			statusCode: 404,
			message: 'No matching Spotify track found.',
			code: 'TRACK_NOT_FOUND',
		});
	});

	test('getSpotifyTrackFromDetails delegates to Spotify provider and returns results', async () => {
		const spotifyTrack: SpotifyTrack = {
			songTitle: 'Super',
			songArtists: ['SEVENTEEN'],
			spotifyUri: 'spotify:track:super',
		};
		const spotifyTracks = [spotifyTrack];

		(getSpotifyTracks as any).mockResolvedValue(spotifyTracks);

		const result = await getSpotifyTrackFromDetails('Super', ['SEVENTEEN']);

		expect(getSpotifyTracks).toHaveBeenCalledWith('Super', ['SEVENTEEN'], undefined);
		expect(result).toEqual(spotifyTracks);
	});

	test('getSpotifyTrackFromDetails forwards limit to provider', async () => {
		(getSpotifyTracks as any).mockResolvedValue([
			{ songTitle: 'Song A', songArtists: ['Artist A'], spotifyUri: 'spotify:track:1' },
			{ songTitle: 'Song B', songArtists: ['Artist B'], spotifyUri: 'spotify:track:2' },
		]);

		const result = await getSpotifyTrackFromDetails('Song', ['Artist'], 2);

		expect(getSpotifyTracks).toHaveBeenCalledWith('Song', ['Artist'], 2);
		expect(result).toHaveLength(2);
	});

	test('getSpotifyTrackFromDetails maps Spotify provider errors to 503', async () => {
		(getSpotifyTracks as any).mockRejectedValue(new Error('Spotify unavailable'));

		await expect(getSpotifyTrackFromDetails('Song', ['Artist'], 2)).rejects.toMatchObject({
			statusCode: 503,
			message: 'Spotify service is unavailable.',
			code: 'SPOTIFY_UNAVAILABLE',
		});
	});

	test('getSpotifyTrackFromDetails maps provider not-found errors to 404', async () => {
		(getSpotifyTracks as any).mockRejectedValue(new Error('No Spotify track found for "Song".'));

		await expect(getSpotifyTrackFromDetails('Song', ['Artist'], 2)).rejects.toMatchObject({
			statusCode: 404,
			message: 'No matching Spotify track found.',
			code: 'TRACK_NOT_FOUND',
		});
	});
});
