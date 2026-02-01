// ─── Existing types (already in your bible.types.ts) ────────────────────────
// Book, Chapter, Verse, SearchVersesRequest, SearchVersesResponse

// ─── New types to ADD to your bible.types.ts ─────────────────────────────────

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange';

export interface Highlight {
  id: string;                        // uuid generated client-side
  verseId: number;                   // FK → Verse.id
  bookId: number;
  chapterId: number;
  color: HighlightColor;
  note?: string;                     // optional annotation on the highlight
  createdAt: string;                 // ISO string
}

export interface Bookmark {
  id: string;
  verseId: number;
  bookId: number;
  chapterId: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  note?: string;
  createdAt: string;
}

export interface ReadingProgress {
  bookId: number;
  bookName: string;
  totalChapters: number;
  completedChapters: number[];       // array of chapter numbers finished
  lastReadChapter: number;
  lastReadVerse: number;
  lastReadAt: string;
}

export interface AudioState {
  isPlaying: boolean;
  currentVerseIndex: number;
  rate: number;                      // 0.5 | 1 | 1.5 | 2
  voice: SpeechSynthesisVoice | null;
}
