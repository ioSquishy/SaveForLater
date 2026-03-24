import * as fs from "node:fs";
import { describe, expect, test } from 'vitest'
import { getScannedTrackFromBase64 } from "./gemini.provider";
import Mime from "../types/Mime";

async function testLocalImage(pathToImg: string, mimeType: Mime) {
  const base64ImageFile = fs.readFileSync(pathToImg, {
    encoding: "base64",
  });
  
  try {
    return await getScannedTrackFromBase64(base64ImageFile, mimeType);
  } catch (e) {
    throw e;
  }
}

describe("getTrackFromBase64 Real Tests", () => {
  test('multiple artists', async () => {
    let result = await testLocalImage("test/track_images/artists.jpg", Mime.JPEG);
    expect(result).toMatchObject({
      songTitle: 'More Than Ever',
      songArtists: [ 'Andrea Chahayed', 'Jackson Rau' ]
    });
    expect(result?.certainty).toBeGreaterThan(0.5);
  }, 30000);
  
  test('full screenshot', async () => {
    let result = await testLocalImage("test/track_images/full.PNG", Mime.PNG);
    expect(result).toMatchObject({
      songTitle: 'ONE LAST TIME',
      songArtists: [ 'COOING' ]
    });
    expect(result?.certainty).toBeGreaterThan(0.5);
  }, 30000);
  
  test('foreign language', async () => {
    let result = await testLocalImage("test/track_images/lang.jpg", Mime.JPEG);
    expect(result).toMatchObject({
      songTitle: '東京劇場',
      songArtists: [ 'Ettone' ]
    });
    expect(result?.certainty).toBeGreaterThan(0.5);
  }, 30000);
  
  test('simple', async () => {
    let result = await testLocalImage("test/track_images/simple.jpg", Mime.JPEG);
    expect(result).toMatchObject({
      songTitle: 'kiss me blue',
      songArtists: [ 'pami' ]
    });
    expect(result?.certainty).toBeGreaterThan(0.5);
  }, 30000);
});