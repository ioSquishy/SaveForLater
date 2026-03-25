import request from 'supertest';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { app } from '../app';
import Mime from '../types/Mime';
import type SpotifyTrack from '../types/SpotifyTrack';
import { getSpotifyTrackFromDetails, getSpotifyTrackFromImage } from '../services/track.service';

vi.mock('../services/track.service', () => ({
	getSpotifyTrackFromImage: vi.fn(),
	getSpotifyTrackFromDetails: vi.fn(),
}));

describe('POST /search/image', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns 200 and track payload when request is valid', async () => {
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

  test('returns 400 when payload is invalid', async () => {
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

  test('returns 500 when service throws', async () => {
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

describe('GET /search/details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns 200 and track array payload when query is valid', async () => {
    const mockedTracks: SpotifyTrack[] = [{
      songTitle: 'kiss me blue',
      songArtists: ['pami'],
      spotifyUri: 'spotify:track:2sC6GuRvSFgHJerlWqrRYf',
    }];

    (getSpotifyTrackFromDetails as any).mockResolvedValue(mockedTracks);

    const response = await request(app)
      .get('/search/details')
      .query({ songTitle: 'kiss me blue', artists: 'pami' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedTracks);
    expect(getSpotifyTrackFromDetails).toHaveBeenCalledWith('kiss me blue', ['pami'], 10);
  });

  test('returns 200 when multiple artists are passed in query', async () => {
    const mockedTracks: SpotifyTrack[] = [{
      songTitle: 'More Than Ever',
      songArtists: ['Andrea Chahayed', 'Jackson Rau', 'Swoon', 'Gelo'],
      spotifyUri: 'spotify:track:0U46xxypZWLnGD7vmzL7sb',
      albumImgUri: 'https://i.scdn.co/image/ab67616d0000b2739ede10a5922585fb49594fb9',
    }];

    (getSpotifyTrackFromDetails as any).mockResolvedValue(mockedTracks);

    const response = await request(app)
      .get('/search/details')
      .query({ songTitle: 'More Than Ever', artists: ['Andrea Chahayed', 'Jackson Rau'] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedTracks);
    expect(getSpotifyTrackFromDetails).toHaveBeenCalledWith('More Than Ever', ['Andrea Chahayed', 'Jackson Rau'], 10);
  });

  test('returns 200 and passes through numeric limit', async () => {
    const mockedTracks: SpotifyTrack[] = [
      { songTitle: 'Song A', songArtists: ['Artist A'], spotifyUri: 'spotify:track:1' },
      { songTitle: 'Song B', songArtists: ['Artist B'], spotifyUri: 'spotify:track:2' },
    ];

    (getSpotifyTrackFromDetails as any).mockResolvedValue(mockedTracks);

    const response = await request(app)
      .get('/search/details')
      .query({ songTitle: 'Song', artists: 'Artist', limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedTracks);
    expect(getSpotifyTrackFromDetails).toHaveBeenCalledWith('Song', ['Artist'], 2);
  });

  test('returns 400 when songTitle is missing', async () => {
    const response = await request(app)
      .get('/search/details')
      .query({ artists: 'pami' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Invalid Request');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(getSpotifyTrackFromDetails).not.toHaveBeenCalled();
  });

  test('returns 400 when limit is out of bounds', async () => {
    const response = await request(app)
      .get('/search/details')
      .query({ songTitle: 'kiss me blue', artists: 'pami', limit: 51 });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Invalid Request');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(getSpotifyTrackFromDetails).not.toHaveBeenCalled();
  });

  test('returns 500 when service throws', async () => {
    (getSpotifyTrackFromDetails as any).mockRejectedValue(new Error('spotify unavailable'));

    const response = await request(app)
      .get('/search/details')
      .query({ songTitle: 'More Than Ever', artists: ['Andrea Chahayed', 'Jackson Rau'] });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'Failed to get track',
      message: 'spotify unavailable',
    });
    expect(getSpotifyTrackFromDetails).toHaveBeenCalledWith('More Than Ever', ['Andrea Chahayed', 'Jackson Rau'], 10);
  });
});
