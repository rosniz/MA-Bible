import { create } from 'zustand';
import { aiService } from '@/services/api/ai.service';
import { AIResponse } from '@/services/types/ai.types';

interface BibleState {
  currentQuestion: string;
  currentAnswer: AIResponse | null;
  isLoading: boolean;
  error: string | null;
  
  askQuestion: (question: string) => Promise<AIResponse>;
  setCurrentQuestion: (question: string) => void;
  clearAnswer: () => void;
  clearError: () => void;
}

export const useBibleStore = create<BibleState>((set) => ({
  currentQuestion: '',
  currentAnswer: null,
  isLoading: false,
  error: null,

  askQuestion: async (question: string) => {
    set({ isLoading: true, error: null, currentQuestion: question });
    try {
      const response = await aiService.askQuestion(question);
      set({
        currentAnswer: response,
        isLoading: false,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Une erreur est survenue. Réessayez dans un instant.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentQuestion: (question: string) => {
    set({ currentQuestion: question });
  },

  clearAnswer: () => {
    set({
      currentAnswer: null,
      currentQuestion: '',
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
