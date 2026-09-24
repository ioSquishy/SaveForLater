'use client';
import { useState } from 'react';
import StartScreen from './components/StartScreen';
import ProcessingScreen from './components/ProcessingScreen';
import RefineScreen from './components/RefineScreen';
import TrackRequest from './Types/TrackRequest';
import SpotifyTrack from './Types/SpotifyTrack';
// import ConnectScreen from './components/ConnectScreen';

export default function ExtractionFlow() {
  // Track the current step in the UI
  const [currentStep, setCurrentStep] = useState<'START' | 'PROCESSING' | 'FIX' | 'CONNECT'>('START');

  // Hold the data needed across the entire flow
  const [trackRequests, setTrackRequests] = useState<TrackRequest[]>([]);

  // Track which item is currently being refined (index into trackRequests)
  const [refiningIndex, setRefiningIndex] = useState<number | null>(null);

  function handleUpload(files: File[]) {
    setTrackRequests(files.map((file) => ({ file, state: 'pending' })));
    setCurrentStep('PROCESSING');
  }

  function handleTrackUpdated(index: number, patch: Partial<TrackRequest>) {
    setTrackRequests((prev) =>
      prev.map((trackRequest, i) => (i === index ? { ...trackRequest, ...patch } : trackRequest))
    );
  }

  function handleRefinementNeeded(index: number) {
    console.log(`Attempting to refine ${trackRequests[index].file.name} (index ${index})`);
    if (index < 0 || index >= trackRequests.length) {
      return;
    }

    setRefiningIndex(index);
    setCurrentStep('FIX');
  }

  function handleRefineResolved(track: SpotifyTrack) {
    if (refiningIndex === null) return;

    // Update the track request with the resolved track
    handleTrackUpdated(refiningIndex, { state: 'success', track });

    // Clear refinement state and return to processing
    setRefiningIndex(null);
    setCurrentStep('PROCESSING');
  }

  function handleRefineSkip() {
    if (refiningIndex === null) return;

    // Mark as failed without a track
    handleTrackUpdated(refiningIndex, { state: 'failed' });

    // Clear refinement state and return to processing
    setRefiningIndex(null);
    setCurrentStep('PROCESSING');
  }

  function handleRestart() {
    setTrackRequests([]);
    setCurrentStep('START');
  }

  return (
    <>
      {currentStep === 'START' && (
        <StartScreen onUpload={handleUpload} />
      )}

      {currentStep === 'PROCESSING' && (
        <ProcessingScreen
          trackRequests={trackRequests}
          onRestart={handleRestart}
          onTrackUpdated={handleTrackUpdated}
          onRefinementNeeded={handleRefinementNeeded}
          onProcessingComplete={() => setCurrentStep('CONNECT')}
        />
      )}

      {currentStep === 'FIX' && refiningIndex !== null && (
        <RefineScreen
          trackRequest={trackRequests[refiningIndex]}
          onResolve={handleRefineResolved}
          onSkip={handleRefineSkip}
          onRestart={handleRestart}
        />
      )}

      {currentStep === 'CONNECT' && (
        <>
          <h1>connect</h1>
        </>
      )}
    </>
  );
}