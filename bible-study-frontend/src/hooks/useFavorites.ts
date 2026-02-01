import { useEffect } from 'react';
import { useFavoritesStore } from '@/store/favoritesStore';

export const useFavorites = () => {
  const favoritesStore = useFavoritesStore();

  useEffect(() => {
    favoritesStore.loadFromLocalStorage();
  }, []);

  return {
    verses: favoritesStore.verses,
    conversations: favoritesStore.conversations,
    addVerse: favoritesStore.addVerse,
    removeVerse: favoritesStore.removeVerse,
    isVerseSaved: favoritesStore.isVerseSaved,
    addConversation: favoritesStore.addConversation,
    removeConversation: favoritesStore.removeConversation,
    isConversationSaved: favoritesStore.isConversationSaved,
  };
};
