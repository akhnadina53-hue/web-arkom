// User & Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  title: string;
  status: SessionStatus;
  duration?: number;
  language: string;
  audioUrl?: string;
  transcript?: string;
  summary?: SummaryData;
  keyPoints: string[];
  mindMap?: MindMapData;
  qaHistory: QAItem[];
  generatedAudios: GeneratedAudio[];
  createdAt: Date;
  updatedAt: Date;
}

export enum SessionStatus {
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  TRANSCRIBING = 'TRANSCRIBING',
  SUMMARIZING = 'SUMMARIZING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface SummaryData {
  text: string;
  keyPoints: string[];
  sections: Section[];
}

export interface Section {
  title: string;
  content: string;
  points: string[];
}

export interface MindMapData {
  root: MindMapNode;
}

export interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
}

export interface QAItem {
  id: string;
  sessionId: string;
  question: string;
  correctAnswer: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
  createdAt: Date;
}

export interface GeneratedAudio {
  id: string;
  sessionId: string;
  voice: string;
  languageStyle: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
}

// API Request/Response Types
export interface TranscribeRequest {
  audioBlob: Blob;
  language?: string;
}

export interface TranscribeResponse {
  transcript: string;
  language: string;
  confidence: number;
  duration: number;
}

export interface SummarizeRequest {
  transcript: string;
  maxSentences?: number;
}

export interface SummarizeResponse {
  summary: SummaryData;
  keyPoints: string[];
}

export interface QAGenerateRequest {
  transcript: string;
  questionCount?: number;
}

export interface QAGenerateResponse {
  questions: QAItem[];
}

export interface TTSRequest {
  text: string;
  voice: string;
  languageStyle: string;
}

export interface TTSResponse {
  audioUrl: string;
  duration: number;
}

// Recording State
export interface RecordingState {
  isRecording: boolean;
  duration: number;
  transcript: string;
  chunks: Blob[];
}
