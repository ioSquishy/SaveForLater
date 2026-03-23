import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getSpotifyTrackFromDetails, getSpotifyTrackFromImage } from './track.service'
import Mime from '../types/mime'
import type ScannedTrack from '../types/ScannedTrack'
import type SpotifyTrack from '../types/SpotifyTrack'
import { getScannedTrackFromBase64 } from '../providers/gemini.provider'
import { getSpotifyTrack } from '../providers/spotify.provider'

vi.mock('../providers/gemini.provider', () => ({
	getScannedTrackFromBase64: vi.fn(),
}));

vi.mock('../providers/spotify.provider', () => ({
	getSpotifyTrack: vi.fn(),
}));

describe('track.service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	});

	test('getSpotifyTrackFromImage returns Spotify track when extraction certainty is high', async () => {
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
		(getSpotifyTrack as any).mockResolvedValue(spotifyTrack);

		const result = await getSpotifyTrackFromImage('base64-data', Mime.JPEG);

		expect(result).toEqual(spotifyTrack);
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
		expect(getSpotifyTrack).not.toHaveBeenCalled();
	});

	test('getSpotifyTrackFromImage rethrows Gemini provider errors', async () => {
		(getScannedTrackFromBase64 as any).mockRejectedValue(new Error('Gemini unavailable'));

		await expect(getSpotifyTrackFromImage('base64-data', Mime.WEBP)).rejects.toThrow('Gemini unavailable');
		expect(getSpotifyTrack).not.toHaveBeenCalled();
	});

	test('getSpotifyTrackFromImage rethrows Spotify provider errors', async () => {
		(getScannedTrackFromBase64 as any).mockResolvedValue({
			songTitle: 'Numb/Encore',
			songArtists: ['Jay-Z', 'Linkin Park'],
			certainty: 0.8,
		} as ScannedTrack);
		(getSpotifyTrack as any).mockRejectedValue(new Error('Spotify unavailable'));

		await expect(getSpotifyTrackFromImage('base64-data', Mime.JPEG)).rejects.toThrow('Spotify unavailable')
	});

	test('getSpotifyTrackFromDetails delegates to Spotify provider and returns result', async () => {
		const spotifyTrack: SpotifyTrack = {
			songTitle: 'Super',
			songArtists: ['SEVENTEEN'],
			spotifyUri: 'spotify:track:super',
		};

		(getSpotifyTrack as any).mockResolvedValue(spotifyTrack);

		const result = await getSpotifyTrackFromDetails('Super', ['SEVENTEEN']);

		expect(getSpotifyTrack).toHaveBeenCalledWith('Super', ['SEVENTEEN']);
		expect(result).toEqual(spotifyTrack);
	});
});
