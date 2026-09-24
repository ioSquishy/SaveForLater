'use client';
import { useEffect, useRef, useState } from 'react';
import TrackRequest from '../Types/TrackRequest';
import SpotifyTrack from '../Types/SpotifyTrack';
import RestartHeader from './RestartHeader';
import ErrorAlert from './ErrorAlert';

interface RefineScreenProps {
  trackRequest: TrackRequest;
  onResolve: (track: SpotifyTrack) => void;
  onSkip: () => void;
  onRestart: () => void;
}

interface SearchResult {
  track: SpotifyTrack;
  index: number;
}

export default function RefineScreen({
  trackRequest,
  onResolve,
  onSkip,
  onRestart,
}: RefineScreenProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [songTitle, setSongTitle] = useState('');
  const [artists, setArtists] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create object URL for image preview (user uploaded image)
  useEffect(() => {
    const url = URL.createObjectURL(trackRequest.file);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [trackRequest.file]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!songTitle.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        if (!serverUrl) {
          const errorMsg = 'Server URL is not configured. Please check your environment variables.';
          console.error('NEXT_PUBLIC_SERVER_URL env variable not found');
          setSearchError(errorMsg);
          setIsSearching(false);
          return;
        }

        const params = new URLSearchParams();
        params.append('songTitle', songTitle.trim());

        if (artists.trim()) {
          const artistList = artists.split(',').map((a) => a.trim());
          artistList.forEach((artist) => {
            if (artist) params.append('artists', artist);
          });
        }

        const endpoint = `${serverUrl.replace(/\/$/, '')}/search/details?${params.toString()}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          const errorMsg = `Search failed: ${response.statusText}`;
          console.error('Search failed:', response.statusText);
          setSearchError(errorMsg);
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        const data = await response.json();
        const results = Array.isArray(data) ? data : [data];
        setSearchResults(results.map((track, index) => ({ track, index })));
        setSelectedTrackIndex(null);
        setSearchError(null);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unexpected error while searching tracks';
        console.error('Error searching tracks:', error);
        setSearchError(errorMsg);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [songTitle, artists]);

  function handleConfirm() {
    if (selectedTrackIndex !== null && selectedTrackIndex < searchResults.length) {
      onResolve(searchResults[selectedTrackIndex].track);
    }
  }

  function handleSelectResult(index: number) {
    setSelectedTrackIndex(index);
  }

  function handleErrorRetry() {
    setSearchError(null);
  }

  const isConfirmDisabled = selectedTrackIndex === null || isSearching;

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5">
      {searchError && (
        <ErrorAlert
          title="Search Error"
          message={searchError}
          onRetry={handleErrorRetry}
          onRestart={onRestart}
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-6rem] top-[-6rem] size-96 rounded-full bg-[rgb(125_90_220_/_10%)] blur-[60px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-[-6rem] size-96 rounded-full bg-[rgb(78_63_107_/_10%)] blur-[60px]"
      />

      <section className="relative z-20 mx-auto flex w-full max-w-[24.375rem] flex-col">
        <RestartHeader onRestartClick={onRestart} />


        <header className="text-center">
          <p className="label text-[var(--primary)]">Correction Needed</p>
          <h1 className="mt-3 text-[2.25rem] leading-[1.25] tracking-[-0.025em] text-[var(--foreground)]">
            <span className="block">Refine your</span>
            <span className="block text-[var(--primary-container)]">upload.</span>
          </h1>
        </header>

        <p className="mt-6 text-center text-sm leading-[1.4] text-[rgba(202,195,216,0.8)]">
          We couldn't automatically identify this track.
          <br />
          Please verify the metadata details below.
        </p>
        {/* Screenshot Preview */}
        <div className="mt-8 flex flex-col gap-4">
          <div
            className="glass-panel relative overflow-hidden"
            style={{
              borderRadius: 'var(--radius-xl)',
              aspectRatio: '1 / 1',
              backgroundColor: 'rgb(27 27 32 / 40%)',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Screenshot preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[rgb(202_195_216_/_50%)]">
                Loading preview...
              </div>
            )}
          </div>

          {/* Song Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.05em] text-[rgb(202_195_216_/_90%)]">
              Song Title
            </label>
            <input
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Enter song title..."
              className="rounded-[1.5rem] bg-[rgb(53_52_58_/_40%)] px-4 py-3 text-[var(--foreground)] placeholder-[rgb(202_195_216_/_50%)] transition-all outline-none focus:outline-2 focus:outline-[var(--primary)]"
            />
          </div>

          {/* Artists Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.05em] text-[rgb(202_195_216_/_90%)]">
              Artists (comma-separated)
            </label>
            <input
              type="text"
              value={artists}
              onChange={(e) => setArtists(e.target.value)}
              placeholder="e.g., Artist 1, Artist 2"
              className="rounded-[1.5rem] bg-[rgb(53_52_58_/_40%)] px-4 py-3 text-[var(--foreground)] placeholder-[rgb(202_195_216_/_50%)] transition-all outline-none focus:outline-2 focus:outline-[var(--primary)]"
            />
          </div>
        </div>

        {/* Search Results */}
        {(isSearching || searchResults.length > 0) && (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[rgb(202_195_216_/_90%)]">
              {isSearching ? 'Searching...' : `Results (${searchResults.length})`}
            </p>

            <div className="flex flex-col gap-2 max-h-[16rem] overflow-y-auto px-1 py-1 custom-scrollbar">
              {searchResults.map((result) => (
                <button
                  key={result.index}
                  type="button"
                  onClick={() => handleSelectResult(result.index)}
                  className={`flex w-full items-center gap-3 rounded-[1.5rem] px-3 py-2 transition-all ${
                    selectedTrackIndex === result.index
                      ? 'bg-[rgb(125_90_220_/_30%)] ring-1 ring-[var(--primary)]'
                      : 'bg-[rgb(53_52_58_/_20%)] hover:bg-[rgb(53_52_58_/_40%)]'
                  }`}
                >
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-md bg-[rgb(53_52_58_/_90%)]">
                    {result.track.albumImgUri ? (
                      <img
                        src={result.track.albumImgUri}
                        alt=""
                        className="size-full rounded-md object-cover"
                      />
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 1.5V11.2M8 11.2C7.3 10.75 6.55 10.5 5.8 10.5C4.55 10.5 3.5 11.3 3.5 12.35C3.5 13.4 4.55 14.2 5.8 14.2C7.05 14.2 8.1 13.4 8.1 12.35V4.3C8.9 3.9 10 3.6 11.2 3.6C11.7 3.6 12.15 3.65 12.5 3.75V2.15C12.1 2.05 11.65 2 11.2 2C10 2 8.9 2.2 8 2.55V1.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-bold text-[var(--foreground)]">
                      {result.track.songTitle}
                    </p>
                    <p className="truncate text-xs text-[rgb(202_195_216_/_90%)]">
                      {result.track.songArtists.join(', ')}
                    </p>
                  </div>

                  {selectedTrackIndex === result.index && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle cx="6" cy="6" r="5" fill="currentColor" />
                      <path
                        d="M3.2 6.1L5.1 8L8.8 4.3"
                        stroke="#131318"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`btn-primary w-full rounded-[var(--radius-full)] px-6 py-3 font-bold transition-all ${
              isConfirmDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg'
            }`}
            style={
              !isConfirmDisabled
                ? {
                    background: 'var(--primary-gradient)',
                  }
                : {}
            }
          >
            Confirm & Continue
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="btn-tertiary w-full rounded-[var(--radius-full)] px-6 py-3 font-bold transition-all"
            style={{
              background: 'rgb(27 27 32 / 40%)',
              border: '1px solid rgb(255 255 255 / 5%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            Skip This Song
          </button>
        </div>
      </section>
    </main>
  );
}
