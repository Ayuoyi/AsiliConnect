export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  time: string;
}

export interface GeminiError extends Error {
  status?: number;
  code?: string;
}

export interface GeminiResponse {
  text: string;
  error?: GeminiError;
}