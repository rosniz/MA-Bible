import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Highlight,
  HighlightColor,
  Bookmark,
  ReadingProgress,
}  from '../services/types/bible.types.extended';


// ─── Types ────────────────────────────────────────────────────────────────────

interface ReaderState {
  highlights: Highlight[];
  addHighlight: (params: Omit<Highlight, 'id' | 'createdAt'>) => Highlight;
  removeHighlight: (id: string) => void;
  updateHighlightColor: (id: string, color: HighlightColor) => void;
  updateHighlightNote: (id: string, note: string) => void;
  getHighlightsForVerse: (verseId: number) => Highlight[];
  getHighlightsForChapter: (bookId: number, chapterId: number) => Highlight[];

  bookmarks: Bookmark[];
  addBookmark: (params: Omit<Bookmark, 'id' | 'createdAt'>) => Bookmark;
  removeBookmark: (id: string) => void;
  isBookmarked: (verseId: number) => boolean;
  toggleBookmark: (params: Omit<Bookmark, 'id' | 'createdAt'>) => void;

  readingProgress: Record<number, ReadingProgress>;
  markChapterComplete: (bookId: number, bookName: string, chapterNumber: number, totalChapters: number) => void;
  updateLastRead: (bookId: number, bookName: string, chapterNumber: number, verseNumber: number, totalChapters: number) => void;
  getReadingProgress: (bookId: number) => ReadingProgress | null;
  getOverallProgress: () => { booksStarted: number; booksCompleted: number; chaptersRead: number };

  audioRate: number;
  setAudioRate: (rate: number) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      highlights: [],

      addHighlight: (params) => {
        const highlight: Highlight = { ...params, id: uuidv4(), createdAt: new Date().toISOString() };
        set((state) => ({ highlights: [...state.highlights, highlight] }));
        return highlight;
      },

      removeHighlight: (id) => {
        set((state) => ({ highlights: state.highlights.filter((h) => h.id !== id) }));
      },

      updateHighlightColor: (id, color) => {
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, color } : h)),
        }));
      },

      updateHighlightNote: (id, note) => {
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, note } : h)),
        }));
      },

      getHighlightsForVerse: (verseId) => get().highlights.filter((h) => h.verseId === verseId),

      getHighlightsForChapter: (bookId, chapterId) =>
        get().highlights.filter((h) => h.bookId === bookId && h.chapterId === chapterId),

      bookmarks: [],

      addBookmark: (params) => {
        const bookmark: Bookmark = { ...params, id: uuidv4(), createdAt: new Date().toISOString() };
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] }));
        return bookmark;
      },

      removeBookmark: (id) => {
        set((state) => ({ bookmarks: state.bookmarks.filter((b) => b.id !== id) }));
      },

      isBookmarked: (verseId) => get().bookmarks.some((b) => b.verseId === verseId),

      toggleBookmark: (params) => {
        const state = get();
        const existing = state.bookmarks.find((b) => b.verseId === params.verseId);
        if (existing) {
          state.removeBookmark(existing.id);
        } else {
          state.addBookmark(params);
        }
      },

      readingProgress: {},

      markChapterComplete: (bookId, bookName, chapterNumber, totalChapters) => {
        set((state) => {
          const current = state.readingProgress[bookId] || {
            bookId, bookName, totalChapters, completedChapters: [],
            lastReadChapter: 0, lastReadVerse: 0, lastReadAt: new Date().toISOString(),
          };
          const completedChapters = current.completedChapters.includes(chapterNumber)
            ? current.completedChapters
            : [...current.completedChapters, chapterNumber];

          return {
            readingProgress: {
              ...state.readingProgress,
              [bookId]: { ...current, completedChapters, lastReadChapter: chapterNumber, lastReadAt: new Date().toISOString() },
            },
          };
        });
      },

      updateLastRead: (bookId, bookName, chapterNumber, verseNumber, totalChapters) => {
        set((state) => {
          const current = state.readingProgress[bookId] || {
            bookId, bookName, totalChapters, completedChapters: [],
            lastReadChapter: 0, lastReadVerse: 0, lastReadAt: new Date().toISOString(),
          };
          return {
            readingProgress: {
              ...state.readingProgress,
              [bookId]: { ...current, lastReadChapter: chapterNumber, lastReadVerse: verseNumber, lastReadAt: new Date().toISOString() },
            },
          };
        });
      },

      getReadingProgress: (bookId) => get().readingProgress[bookId] || null,

      getOverallProgress: () => {
        const progress = Object.values(get().readingProgress);
        return {
          booksStarted: progress.length,
          booksCompleted: progress.filter((p) => p.completedChapters.length === p.totalChapters).length,
          chaptersRead: progress.reduce((sum, p) => sum + p.completedChapters.length, 0),
        };
      },

      audioRate: 1,
      setAudioRate: (rate) => set({ audioRate: rate }),
    }),
    {
      name: 'bible-reader-store',
    }
  )
);