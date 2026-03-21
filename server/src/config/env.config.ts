import dotenv from 'dotenv';
dotenv.config();

// Helper to ensure we don't have undefined strings
const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    // This will stop the app immediately if a key is missing
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  GEMINI_API_KEY: getEnvOrThrow('GEMINI_API_KEY'),
};