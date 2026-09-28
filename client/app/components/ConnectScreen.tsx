"use client";

import { useState } from "react";
import TrackRequest from "../Types/TrackRequest";

interface ConnectScreenProps {
	onRestart: () => void;
	trackRequests: TrackRequest[];
}

export default function ConnectScreen({ onRestart, trackRequests }: ConnectScreenProps) {
	const [connected, setConnected] = useState(false);
	const discoveredTracks = trackRequests.flatMap(({ track }) => track ? [track] : []);

	function handleConnectSpotify() {
		setConnected(true);
		console.log("Connect to Spotify clicked");
	}

	function handleCreatePlaylist() {
		console.log("Create playlist clicked");
	}

	return (
		<main className="relative min-h-screen overflow-hidden px-6 pb-8 pt-24">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute right-[-5rem] top-56 size-96 rounded-full bg-[rgb(125_90_220_/_30%)] blur-[80px]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute bottom-56 left-[-5rem] size-80 rounded-full bg-[rgb(125_90_220_/_20%)] blur-[80px]"
			/>

			<header className="fixed inset-x-0 top-0 z-20 border-b border-[rgb(201_196_208_/_10%)] bg-[rgb(19_19_24_/_60%)] px-6 py-4 backdrop-blur-xl">
				<button
					type="button"
					onClick={onRestart}
					className="inline-flex items-center gap-2 text-left font-[var(--font-display)] text-lg font-bold tracking-[-0.025em] text-[var(--primary)]"
				>
					<img src="/restart_icon.svg" alt="" aria-hidden="true" className="size-4" />
					<span>Restart</span>
				</button>
			</header>

			<section className="relative z-10 mx-auto w-full max-w-[32rem]">
				<div className="flex justify-center">
					<div className="relative flex size-32 rotate-[-3deg] items-center justify-center rounded-[3rem] border border-[rgb(73_68_85_/_15%)] bg-[rgb(27_27_32_/_40%)] shadow-[0_0_40px_rgb(125_90_220_/_20%)] backdrop-blur-lg">
						<img src="/connect-music-note.svg" alt="" aria-hidden="true" className="size-[50px]" />
						<span aria-hidden="true" className="absolute -right-5 -top-5 size-12 rotate-12 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md" />
						<span aria-hidden="true" className="absolute -bottom-4 -left-7 size-16 -rotate-12 rounded-full border border-[rgb(206_189_255_/_20%)] bg-[rgb(206_189_255_/_10%)] backdrop-blur-md" />
					</div>
				</div>

				<div className="mt-10 text-center">
					<h1 className="text-[2.25rem] text-[var(--foreground)]">
						Ready to <span className="text-[var(--primary-container)]">Groove.</span>
					</h1>
					<p className="mt-3 text-lg text-[rgb(202_195_216_/_80%)]">
						{discoveredTracks.length} song{discoveredTracks.length === 1 ? "" : "s"} ready to be added!
					</p>
				</div>

				<div className="mt-12 flex flex-col gap-4">
					<button
						type="button"
						onClick={handleConnectSpotify}
						className={`flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-semibold transition ${
							connected
								? "border border-[rgb(73_68_85_/_15%)] bg-[rgb(27_27_32_/_40%)] text-[var(--foreground)] backdrop-blur-md"
								: "bg-[linear-gradient(170deg,var(--primary),var(--primary-container))] text-[#390094] shadow-[0_20px_20px_rgb(125_90_220_/_30%)]"
						}`}
					>
						<img src="/lightning.svg" alt="" aria-hidden="true" className="size-4" />
						<span>{connected ? "Connected to Spotify" : "Connect to Spotify"}</span>
					</button>
					<button
						type="button"
						onClick={handleCreatePlaylist}
						className={`flex w-full items-center justify-center gap-3 rounded-full border px-8 py-4 font-semibold transition ${
							connected
								? "border-transparent bg-[linear-gradient(170deg,var(--primary),var(--primary-container))] text-[#390094] shadow-[0_20px_20px_rgb(125_90_220_/_30%)]"
								: "border-[rgb(73_68_85_/_15%)] bg-[rgb(27_27_32_/_40%)] text-[var(--foreground)] backdrop-blur-md"
						}`}
					>
						<img src="/playlist.svg" alt="" aria-hidden="true" className="h-[14px] w-[19px]" />
						<span>Create Playlist</span>
					</button>
				</div>

				<div className="mt-12">
					<div className="flex items-center justify-between px-2">
						<h2 className="label font-bold text-[rgb(202_195_216_/_70%)]">Discovered Tracks</h2>
						<span className="text-xs font-medium text-[rgb(206_189_255_/_80%)]">
							{discoveredTracks.length} item{discoveredTracks.length === 1 ? "" : "s"}
						</span>
					</div>
					<div className="mt-4 flex max-h-[380px] flex-col gap-3 overflow-hidden pr-2">
						{discoveredTracks.map((track) => (
							<div
								key={track.spotifyUri || `${track.songTitle}-${track.songArtists.join(",")}`}
								className="flex items-center justify-between rounded-2xl border border-[rgb(73_68_85_/_10%)] bg-[rgb(27_27_32_/_40%)] p-4 backdrop-blur-md"
							>
								<div className="flex min-w-0 items-center gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgb(125_90_220_/_20%)]">
										{track.albumImgUri ? (
											<img src={track.albumImgUri} alt="" className="size-full object-cover opacity-80" />
										) : (
											<img src="/music_note.svg" alt="" aria-hidden="true" className="size-5" />
										)}
									</div>
									<div className="min-w-0 text-left">
										<p className="truncate font-semibold text-[var(--foreground)]">{track.songTitle}</p>
										<p className="truncate text-sm text-[rgb(202_195_216_/_90%)]">{track.songArtists.join(", ")}</p>
									</div>
								</div>
								<a
									href={track.spotifyUri}
									target="_blank"
									rel="noreferrer"
									aria-label={`Open ${track.songTitle} in Spotify`}
									className="shrink-0 rounded-full p-1 transition hover:bg-[rgb(206_189_255_/_10%)]"
								>
									<img src="/link.svg" alt="" aria-hidden="true" className="size-[18px]" />
								</a>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
