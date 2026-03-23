import spotifySdk from "../config/spotify.config";
import SpotifyTrack, {spotifyTrackSchema} from "../types/SpotifyTrack";

export async function getSpotifyTrack(songTitle: string, songArtists?: string[]): Promise<SpotifyTrack> {
	const trimmedTitle = songTitle.trim();
	if (!trimmedTitle) {
		throw new Error("Song title cannot be empty.");
	}

	const normalize = (value: string): string => value.trim().toLowerCase();
	const requestedArtists = (songArtists ?? []).map(normalize).filter(Boolean);

	const artistQuery = requestedArtists.map((artist) => `artist:${artist}`).join(" ");
	const query = artistQuery ? `track:${trimmedTitle} ${artistQuery}` : `track:${trimmedTitle}`;

	const response = await spotifySdk.search(query, ["track"], undefined, 10);
	const candidates = response.tracks.items;

	if (!candidates.length) {
		throw new Error(`No Spotify track found for \"${trimmedTitle}\".`);
	}

	const bestMatch = requestedArtists.length
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
				.reduce((best, current) =>
					current.artistMatchScore > best.artistMatchScore ? current : best
				).track
		: candidates[0];

	const albumImgUri = bestMatch.album.images[0]?.url;

	return spotifyTrackSchema.parse({
		songTitle: bestMatch.name,
		songArtists: bestMatch.artists.map((artist) => artist.name),
		spotifyUri: bestMatch.uri,
		...(albumImgUri ? { albumImgUri } : {}),
	});
}