import request from 'supertest';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { app } from '../app';
import Mime from '../types/Mime';
import type SpotifyTrack from '../types/SpotifyTrack';
import { getSpotifyTrackFromImage } from '../services/track.service';

vi.mock('../services/track.service', () => ({
	getSpotifyTrackFromImage: vi.fn(),
}));

describe('search routes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('POST /search/image returns 200 and track payload when request is valid', async () => {
		const mockedTrack: SpotifyTrack = {
			songTitle: 'Super',
			songArtists: ['SEVENTEEN'],
			spotifyUri: 'spotify:track:super',
			albumImgUri: 'https://img.test/super.jpg',
		};

		(getSpotifyTrackFromImage as any).mockResolvedValue(mockedTrack);

		const response = await request(app)
			.post('/search/image')
			.send({
				base64Image: 'base64-data',
				mimeType: Mime.JPEG,
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockedTrack);
		expect(getSpotifyTrackFromImage).toHaveBeenCalledWith('base64-data', Mime.JPEG);
	});

	test('POST /search/image returns 400 when payload is invalid', async () => {
		const response = await request(app)
			.post('/search/image')
			.send({
				base64Image: '',
				mimeType: Mime.JPEG,
			});

		expect(response.status).toBe(400);
		expect(response.body.status).toBe('Invalid Request');
		expect(Array.isArray(response.body.errors)).toBe(true);
		expect(getSpotifyTrackFromImage).not.toHaveBeenCalled();
	});

	test('POST /search/image returns 500 when service throws', async () => {
		(getSpotifyTrackFromImage as any).mockRejectedValue(new Error('service unavailable'));

		const response = await request(app)
			.post('/search/image')
			.send({
				base64Image: 'base64-data',
				mimeType: Mime.WEBP,
			});

		expect(response.status).toBe(500);
		expect(response.body).toEqual({
			status: 'Failed to get track',
			message: 'service unavailable',
		});
	});
});
