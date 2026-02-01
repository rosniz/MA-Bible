export interface AIVerse {
  text: string;
  reference: string;
}

export interface AIResponse {
  id?: number;
  question: string;
  summary: string;
  verses: AIVerse[];
  explanation: string;
  application: string;
  prayer: string;
  created_at?: string;
  ai_provider?: string;
  processing_time?: number;
}

export interface AskQuestionRequest {
  question: string;
}

export interface Conversation {
  id: number;
  question: string;
  response: AIResponse;
  created_at: string;
  ai_provider: string;
  processing_time: number;
}
