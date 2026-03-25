import { MaxInt } from "@spotify/web-api-ts-sdk";
import spotifySdk from "../config/spotify.config";
import SpotifyTrack, {spotifyTrackSchema} from "../types/SpotifyTrack";

function numberToLimit(limit?: number): MaxInt<50> {
	if (limit === undefined) return 5; // default search window

	if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
			throw new Error("limit must be an integer between [1-50]");
	}

	// enforce minimum 5 for better matching
	return (limit < 5 ? 5 : limit) as MaxInt<50>;
}

export async function getSpotifyTracks(songTitle: string, songArtists?: string[], limit?: number): Promise<SpotifyTrack[]> {
	const trimmedTitle = songTitle.trim();
	if (!trimmedTitle) {
		throw new Error("Song title cannot be empty.");
	}

	const normalize = (value: string): string => value.trim().toLowerCase();
	const requestedArtists = (songArtists ?? []).map(normalize).filter(Boolean);

	const artistQuery = requestedArtists.map((artist) => `artist:${artist}`).join(" ");
	const query = artistQuery ? `track:${trimmedTitle} ${artistQuery}` : `track:${trimmedTitle}`;

	// minimum limit of 5 to get surrounding results in case there is a better match lower down the list
	const searchLimit = numberToLimit(limit);
	const response = await spotifySdk.search(query, ["track"], undefined, searchLimit);
	const candidates = response.tracks.items;

	if (!candidates.length) {
		throw new Error(`No Spotify track found for \"${trimmedTitle}\".`);
	}

	const scoredCandidates = requestedArtists.length
		? candidates
				.map((track) => {
					const normalizedTrackArtists = track.artists.map((artist) => normalize(artist.name));
					const artistMatchScore = requestedArtists.reduce((score, requestedArtist) => {
						const hasMatch = normalizedTrackArtists.some(
							(trackArtist) =>
								trackArtist === requestedArtist ||
								trackArtist.includes(requestedArtist) ||
								requestedArtist.includes(trackArtist)
						);
						return hasMatch ? score + 1 : score;
					}, 0);

					return { track, artistMatchScore };
				})
				.sort((a, b) => b.artistMatchScore - a.artistMatchScore)
		: candidates.map((track) => ({ track, artistMatchScore: 0 }));

	const maxResults = limit ?? candidates.length;
	return scoredCandidates.slice(0, maxResults).map(({ track }) => {
		const albumImgUri = track.album.images[0]?.url;

		return spotifyTrackSchema.parse({
			songTitle: track.name,
			songArtists: track.artists.map((artist) => artist.name),
			spotifyUri: track.uri,
			...(albumImgUri ? { albumImgUri } : {}),
		});
	});
}