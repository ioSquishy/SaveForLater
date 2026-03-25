import * as fs from "node:fs";
import { describe, expect, test } from "vitest";
import { getSpotifyTrackFromDetails, getSpotifyTrackFromImage } from "./track.service";
import Mime from "../types/Mime";

/**
 * Gets base 64 encoding of local test image file
 * @param filePath example: "test/track_images/full.PNG"
 * @returns base64 encoding
 */
function getLocalFileBase64(filePath: string) {
  return fs.readFileSync(filePath, {
    encoding: "base64",
  });
}

describe("getSpotifyTrackFromImage Real Tests", () => {
  test("simple", async () => {
    const result = await getSpotifyTrackFromImage(
      getLocalFileBase64("test/track_images/simple.jpg"),
      Mime.JPEG
    );

    expect(result).toMatchObject({
      songTitle: "kiss me blue",
      songArtists: ["pami"],
      spotifyUri: "spotify:track:2sC6GuRvSFgHJerlWqrRYf",
    });
  }, 30000);

  test("multiple artists", async () => {
    const result = await getSpotifyTrackFromImage(
      getLocalFileBase64("test/track_images/artists.jpg"),
      Mime.JPEG
    );

    expect(result).toMatchObject({
      songTitle: "More Than Ever",
      songArtists: ["Andrea Chahayed", "Jackson Rau", "Swoon", "Gelo"],
      spotifyUri: "spotify:track:0U46xxypZWLnGD7vmzL7sb",
      albumImgUri: "https://i.scdn.co/image/ab67616d0000b2739ede10a5922585fb49594fb9",
    });
  }, 30000);

  test("foreign language", async () => {
    const result = await getSpotifyTrackFromImage(
      getLocalFileBase64("test/track_images/lang.jpg"),
      Mime.JPEG
    );

    expect(result).toMatchObject({
      songTitle: "東京劇場",
      songArtists: ["Ettone"],
      spotifyUri: "spotify:track:3s4JDaCXYLtSdVU6GItAFy",
      albumImgUri: "https://i.scdn.co/image/ab67616d0000b2735887c18c5ebe6d84452d8483",
    });
  }, 30000);

  test("full screenshot", async () => {
    const result = await getSpotifyTrackFromImage(
      getLocalFileBase64("test/track_images/full.PNG"),
      Mime.PNG
    );

    expect(result).toMatchObject({
      songTitle: "ONE LAST TIME",
      songArtists: ["COOING"],
      spotifyUri: "spotify:track:1D42kRhIoq4FDn0GYFSCPl",
      albumImgUri: "https://i.scdn.co/image/ab67616d0000b273d81b96c9d0528f7b35d54e31",
    });
  }, 30000);
});

describe("getSpotifyTrackFromDetails Real Tests", () => {
  test("simple", async () => {
    const results = await getSpotifyTrackFromDetails("kiss me blue", ["pami"]);
    const result = results[0];

    expect(results.length).toBeGreaterThan(0);
    expect(result).toMatchObject({
      songTitle: "kiss me blue",
      songArtists: ["pami"],
      spotifyUri: "spotify:track:2sC6GuRvSFgHJerlWqrRYf",
    });
  }, 30000);

  test("multiple artists", async () => {
    const results = await getSpotifyTrackFromDetails("More Than Ever", [
      "Andrea Chahayed",
      "Jackson Rau",
    ]);
    const result = results[0];

    expect(results.length).toBeGreaterThan(0);
    expect(result).toMatchObject({
      songTitle: "More Than Ever",
      songArtists: ["Andrea Chahayed", "Jackson Rau", "Swoon", "Gelo"],
      spotifyUri: "spotify:track:0U46xxypZWLnGD7vmzL7sb",
      albumImgUri: "https://i.scdn.co/image/ab67616d0000b2739ede10a5922585fb49594fb9",
    });
  }, 30000);

  test("foreign language", async () => {
    const results = await getSpotifyTrackFromDetails("東京劇場", ["Ettone"]);
    const result = results[0];

    expect(results.length).toBeGreaterThan(0);
    expect(result).toMatchObject({
      songTitle: "東京劇場",
      songArtists: ["Ettone"],
      spotifyUri: "spotify:track:3s4JDaCXYLtSdVU6GItAFy",
      albumImgUri: "https://i.scdn.co/image/ab67616d0000b2735887c18c5ebe6d84452d8483",
    });
  }, 30000);

  test("full screenshot track details", async () => {
    const results = await getSpotifyTrackFromDetails("ONE LAST TIME", ["COOING"]);
    const result = results[0];

    expect(results.length).toBeGreaterThan(0);
    expect(result).toMatchObject({
      songTitle: "ONE LAST TIME",
      songArtists: ["COOING"],
      spotifyUri: "spotify:track:1D42kRhIoq4FDn0GYFSCPl",
      albumImgUri: "https://i.scdn.co/image/ab67616d0000b273d81b96c9d0528f7b35d54e31",
    });
  }, 30000);

  test("respects limit for details lookup", async () => {
    const results = await getSpotifyTrackFromDetails("Numb/Encore", ["Jay-Z", "Linkin Park"], 1);

    expect(results).toHaveLength(1);
    expect(results[0].spotifyUri).toMatch(/^spotify:track:/);
  }, 30000);
});