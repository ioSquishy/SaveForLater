import { useEffect, useRef, useState } from "react";
import TrackRequest from "../Types/TrackRequest";
import RestartHeader from "./RestartHeader"
import SpotifyTrack from "../Types/SpotifyTrack";

interface ProcessingScreenProps {
  trackRequests: TrackRequest[];
  onRestart: () => void;
  onTrackUpdated: (index: number, patch: TrackRequest) => void;
  onRefinementNeeded: (refineIndex: number) => void;
  onProcessingComplete: () => void;
}

interface SongRowProps {
  track: SpotifyTrack;
  state: "faded" | "dim" | "active";
}

function SongRow({ track, state }: SongRowProps) {
  const rowOpacity = state === "faded" ? "opacity-20" : state === "dim" ? "opacity-50" : ""
  const rowClassName =
    state === "active"
      ? "relative flex w-full items-center gap-4 rounded-[2rem] border border-[rgb(73_68_85_/_10%)] bg-[rgb(53_52_58_/_30%)] p-4 backdrop-blur-[8px]"
      : `flex w-full items-center gap-4 ${rowOpacity}`

  return (
    <div className={rowClassName}>
      <div
        className={
          state === "active"
            ? "flex size-14 items-center justify-center rounded-md bg-[rgb(53_52_58_/_90%)]"
            : "flex size-12 items-center justify-center rounded-md bg-[rgb(53_52_58_/_90%)]"
        }
      >
        {
          track.albumImgUri ?
            <img src={track.albumImgUri} width="14" height="14" />
            : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 1.5V11.2M8 11.2C7.3 10.75 6.55 10.5 5.8 10.5C4.55 10.5 3.5 11.3 3.5 12.35C3.5 13.4 4.55 14.2 5.8 14.2C7.05 14.2 8.1 13.4 8.1 12.35V4.3C8.9 3.9 10 3.6 11.2 3.6C11.7 3.6 12.15 3.65 12.5 3.75V2.15C12.1 2.05 11.65 2 11.2 2C10 2 8.9 2.2 8 2.55V1.5Z" fill="currentColor"/></svg>
        }
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="truncate font-[var(--font-display)] text-sm font-bold text-[var(--foreground)]">
            {track.songTitle}
          </p>
          {state === "active" && (
            <span className="rounded-full bg-[rgb(206_189_255_/_10%)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-[var(--primary)]">
              Active
            </span>
          )}
        </div>
        <p className="truncate text-xs text-[rgb(202_195_216_/_90%)]">{track.songArtists.join(", ")}</p>
      </div>

      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="currentColor"/><path d="M3.2 6.1L5.1 8L8.8 4.3" stroke="#131318" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  )
}

export default function ProcessingScreen({
  trackRequests,
  onRestart,
  onTrackUpdated,
  onRefinementNeeded,
  onProcessingComplete
}: ProcessingScreenProps) {
  const [currentFileName, setCurrentFileName] = useState<string>(trackRequests[0]?.file.name ?? "your photos");
  const matchedCount = trackRequests.filter((t) => t.state === "success").length;
  const remainingCount = trackRequests.filter((t) => t.state === "pending").length;

  function getDisplayTrackRequests() : SongRowProps[] {
    let displayPlaylist : SongRowProps[] = trackRequests.filter(t => t.state === "success" && t.track)
      .slice(-3)
      .map<SongRowProps>(trackRequest => (
        {
          track: trackRequest.track ?? {songTitle: "Unknown", songArtists: ["Unknown"], spotifyUri: ""},
          state: "active"
        }
      ));
    switch (displayPlaylist.length) {
      case 3:
        displayPlaylist[0].state = "faded";
        displayPlaylist[1].state = "dim";
        break;
      case 2:
        displayPlaylist[0].state = "dim";
        break;
    }
    return displayPlaylist;
  }

  useEffect(() => {
    let nextPendingTrack = trackRequests.find((trackRequest) => trackRequest.state === "pending");
    if (nextPendingTrack) {
      setCurrentFileName(nextPendingTrack.file.name);
      const trackIndex = trackRequests.indexOf(nextPendingTrack);
      // TODO: process request
      nextPendingTrack.track = {
        songTitle: "hi",
        songArtists: ["a"],
        spotifyUri: "1"
      }
      nextPendingTrack.state = "success";
      // handle failure
      onTrackUpdated(trackIndex, nextPendingTrack);
      return;
    }
    // onProcessingComplete();
  }, [trackRequests]);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-6rem] top-[-6rem] size-96 rounded-full bg-[rgb(125_90_220_/_10%)] blur-[60px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-[-6rem] size-96 rounded-full bg-[rgb(78_63_107_/_10%)] blur-[60px]"
      />

      <section className="relative z-20 mx-auto flex w-full max-w-[24.375rem] flex-col">
        <RestartHeader onRestartClick={onRestart}/>

        <header className="text-center">
          <p className="label text-[var(--primary)]">Analyzing Gallery</p>
          <h1 className="mt-3 text-[2.25rem] leading-[1.25] tracking-[-0.025em] text-[var(--foreground)]">
            <span className="block">Creating Your</span>
            <span className="block text-[var(--primary-container)]">Playlist.</span>
          </h1>
          <p className="mt-3 text-sm text-[rgb(202_195_216_/_95%)]">Processing {currentFileName}</p>
        </header>

        <section
          className="glass-panel relative mt-9 overflow-hidden px-6 pb-12 pt-20"
          style={{
            borderRadius: "3rem",
            background: "rgb(27 27 32 / 40%)",
            boxShadow: "0 0 30px rgb(206 189 255 / 15%)",
          }}
        >
          <div className="absolute inset-0 rounded-[3rem] border border-[rgb(73_68_85_/_15%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgb(27_27_32)] to-[rgb(27_27_32_/_0%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgb(27_27_32)] to-[rgb(27_27_32_/_0%)]" />

          <div className="relative z-10 flex flex-col gap-6">
            {
              getDisplayTrackRequests().map((songRow, index) => (
                <SongRow key={`song-row-${index}`} {...songRow} />
              ))
            }

            <div className="flex w-full items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-md bg-[rgb(53_52_58_/_50%)] text-[var(--foreground-muted)]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 1.5V11.2M8 11.2C7.3 10.75 6.55 10.5 5.8 10.5C4.55 10.5 3.5 11.3 3.5 12.35C3.5 13.4 4.55 14.2 5.8 14.2C7.05 14.2 8.1 13.4 8.1 12.35V4.3C8.9 3.9 10 3.6 11.2 3.6C11.7 3.6 12.15 3.65 12.5 3.75V2.15C12.1 2.05 11.65 2 11.2 2C10 2 8.9 2.2 8 2.55V1.5Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 rounded-full bg-[rgb(53_52_58_/_50%)]" />
                <div className="h-3 w-20 rounded-full bg-[rgb(53_52_58_/_30%)]" />
              </div>
              <span className="text-[10px] text-[rgb(202_195_216_/_85%)]">Scanning...</span>
            </div>
          </div>
        </section>

        <div className="mt-4 px-4">
          <div className="mt-4 flex w-full justify-center">
            <span className="meta-span text-center">
              {matchedCount} songs matched • {remainingCount} photos remaining
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}

