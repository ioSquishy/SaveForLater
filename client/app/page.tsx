'use client';
import { useState } from 'react';
import StartScreen from './components/StartScreen';
import ProcessingScreen from './components/ProcessingScreen';
import TrackRequest from './Types/TrackRequest';
// import FixScreen from './components/FixScreen';
// import ConnectScreen from './components/ConnectScreen';

export default function ExtractionFlow() {
  // Track the current step in the UI
  const [currentStep, setCurrentStep] = useState<'START' | 'PROCESSING' | 'FIX' | 'CONNECT'>('START');

  // Hold the data needed across the entire flow
  const [trackRequests, setTrackRequests] = useState<TrackRequest[]>([]);

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
    if (index < 0 || index >= trackRequests.length) {
      return;
    }

    setCurrentStep('FIX');
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

      {currentStep === 'FIX' && (
        <>
        </>
      )}

      {currentStep === 'CONNECT' && (
        <>
        </>
      )}
    </>
  );
}