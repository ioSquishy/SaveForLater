import SpotifyTrack from "./SpotifyTrack"

export default interface TrackRequest {
  file: File,
  state: "pending" | "success" | "failed"
  track?: SpotifyTrack
}