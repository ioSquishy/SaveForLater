'use client';
import { useState } from 'react';
import StartScreen from './components/StartScreen';
// import ProcessingScreen from './components/ProcessingScreen';
// import FixScreen from './components/FixScreen';
// import ConnectScreen from './components/ConnectScreen';

export default function ExtractionFlow() {
  // Track the current step in the UI
  const [currentStep, setCurrentStep] = useState('START');

  // Hold the data needed across the entire flow
  const [images, setImages] = useState<File[]>([]);
  const [extractedSongs, setExtractedSongs] = useState([]);

  return (
    <>
      {currentStep === 'START' && (
        <StartScreen
          onUpload={(files) => {
            setImages(files);
            setCurrentStep('PROCESSING');
          }}
        />
      )}

      {currentStep === 'PROCESSING' && (
        <>
        </>
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