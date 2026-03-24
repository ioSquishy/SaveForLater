import * as fs from 'node:fs';
import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { app } from '../app';
import Mime from '../types/Mime';

function getLocalFileBase64(filePath: string) {
	return fs.readFileSync(filePath, {
		encoding: 'base64',
	});
}

describe('POST /search/image integration tests', () => {
	test('returns expected track for simple image', async () => {
		const response = await request(app)
			.post('/search/image')
			.send({
				base64Image: getLocalFileBase64('test/track_images/simple.jpg'),
				mimeType: Mime.JPEG,
			});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			songTitle: 'kiss me blue',
			songArtists: ['pami'],
			spotifyUri: 'spotify:track:2sC6GuRvSFgHJerlWqrRYf',
		});
	}, 30000);

	test('returns expected track for full screenshot image', async () => {
		const response = await request(app)
			.post('/search/image')
			.send({
				base64Image: getLocalFileBase64('test/track_images/full.PNG'),
				mimeType: Mime.PNG,
			});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			songTitle: 'ONE LAST TIME',
			songArtists: ['COOING'],
			spotifyUri: 'spotify:track:1D42kRhIoq4FDn0GYFSCPl',
			albumImgUri: 'https://i.scdn.co/image/ab67616d0000b273d81b96c9d0528f7b35d54e31',
		});
	}, 30000);

	test('returns 400 when request payload is invalid', async () => {
		const response = await request(app)
			.post('/search/image')
			.send({
				base64Image: '',
				mimeType: Mime.JPEG,
			});

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject({
			status: 'Invalid Request',
		});
		expect(Array.isArray(response.body.errors)).toBe(true);
	});
});
