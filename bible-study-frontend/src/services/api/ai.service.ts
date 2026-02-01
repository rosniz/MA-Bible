import apiClient from './axios.config';
import {
  AIResponse,
  AskQuestionRequest,
  Conversation,
} from '../types/ai.types';

export const aiService = {
  async askQuestion(question: string): Promise<AIResponse> {
    const response = await apiClient.post<AIResponse>('/ai/ask/', {
      question,
    } as AskQuestionRequest);
    return response.data;
  },

  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/ai/conversations/');
    return response.data;
  },

  async getConversation(id: number): Promise<Conversation> {
    const response = await apiClient.get<Conversation>(`/ai/conversations/${id}/`);
    return response.data;
  },
};
