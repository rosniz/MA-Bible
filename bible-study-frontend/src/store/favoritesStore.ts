import { create } from 'zustand';
import { Verse } from '@/services/types/bible.types';
import { AIResponse } from '@/services/types/ai.types';

interface FavoritesState {
  verses: Verse[];
  conversations: AIResponse[];
  
  addVerse: (verse: Verse) => void;
  removeVerse: (id: number) => void;
  isVerseSaved: (id: number) => boolean;
  
  addConversation: (conversation: AIResponse) => void;
  removeConversation: (question: string) => void;
  isConversationSaved: (question: string) => boolean;
  
  loadFromLocalStorage: () => void;
}

const VERSES_KEY = 'saved_verses';
const CONVERSATIONS_KEY = 'saved_conversations';

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  verses: [],
  conversations: [],

  addVerse: (verse: Verse) => {
    const { verses } = get();
    
    // Check if verse is already saved
    if (verses.some(v => v.id === verse.id)) {
      return;
    }
    
    const updatedVerses = [...verses, verse];
    set({ verses: updatedVerses });
    localStorage.setItem(VERSES_KEY, JSON.stringify(updatedVerses));
  },

  removeVerse: (id: number) => {
    const { verses } = get();
    const updatedVerses = verses.filter(v => v.id !== id);
    set({ verses: updatedVerses });
    localStorage.setItem(VERSES_KEY, JSON.stringify(updatedVerses));
  },

  isVerseSaved: (id: number) => {
    const { verses } = get();
    return verses.some(v => v.id === id);
  },

  addConversation: (conversation: AIResponse) => {
    const { conversations } = get();
    
    // Check if conversation is already saved
    if (conversations.some(c => c.question === conversation.question)) {
      return;
    }
    
    const updatedConversations = [...conversations, conversation];
    set({ conversations: updatedConversations });
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
  },

  removeConversation: (question: string) => {
    const { conversations } = get();
    const updatedConversations = conversations.filter(c => c.question !== question);
    set({ conversations: updatedConversations });
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
  },

  isConversationSaved: (question: string) => {
    const { conversations } = get();
    return conversations.some(c => c.question === question);
  },

  loadFromLocalStorage: () => {
    try {
      const versesStr = localStorage.getItem(VERSES_KEY);
      const conversationsStr = localStorage.getItem(CONVERSATIONS_KEY);
      
      const verses = versesStr ? JSON.parse(versesStr) : [];
      const conversations = conversationsStr ? JSON.parse(conversationsStr) : [];
      
      set({ verses, conversations });
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      set({ verses: [], conversations: [] });
    }
  },
}));
