import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { ENV } from './env.config';

const spotifySdk = SpotifyApi.withClientCredentials(ENV.SPOTIFY_CLIENT_ID, ENV.SPOTIFY_CLIENT_SECRET);

export default spotifySdk;