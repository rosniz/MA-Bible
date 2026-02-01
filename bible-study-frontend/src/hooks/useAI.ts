import { useQuery } from '@tanstack/react-query';
import { useBibleStore } from '@/store/bibleStore';
import { aiService } from '@/services/api/ai.service';

export const useAI = () => {
  const bibleStore = useBibleStore();

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => aiService.getConversations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    currentQuestion: bibleStore.currentQuestion,
    currentAnswer: bibleStore.currentAnswer,
    isLoading: bibleStore.isLoading,
    error: bibleStore.error,
    conversations,
    conversationsLoading,
    askQuestion: bibleStore.askQuestion,
    setCurrentQuestion: bibleStore.setCurrentQuestion,
    clearAnswer: bibleStore.clearAnswer,
    clearError: bibleStore.clearError,
  };
};
