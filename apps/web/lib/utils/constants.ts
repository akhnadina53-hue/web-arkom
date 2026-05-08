export const APP_NAME = 'Fren-Edu';
export const APP_DESCRIPTION = 'AI-Powered Learning Platform';

export const RECORDING_CHUNK_DURATION = 30; // seconds
export const MAX_RECORDING_DURATION = 3600; // 1 hour in seconds
export const MIN_RECORDING_DURATION = 5; // 5 seconds

export const SUPPORTED_LANGUAGES = [
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

export const DEFAULT_LANGUAGE = 'id';

export const VOICE_OPTIONS = [
  { id: 'female-clear', name: 'Female - Clear' },
  { id: 'male-deep', name: 'Male - Deep' },
  { id: 'neutral-formal', name: 'Neutral - Formal' },
];

export const LANGUAGE_STYLES = [
  { id: 'formal', name: 'Formal (Bahasa Baku)' },
  { id: 'casual', name: 'Casual (Sehari-hari)' },
  { id: 'academic', name: 'Academic (Ilmiah)' },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const AI_PROVIDERS = {
  WHISPER: process.env.NEXT_PUBLIC_WHISPER_PROVIDER || 'openai',
  LLM: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'anthropic',
  TTS: process.env.NEXT_PUBLIC_TTS_PROVIDER || 'coqui',
};
