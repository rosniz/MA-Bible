import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronLeft, ChevronRight, Play, Pause,
  SkipBack, SkipForward, Bookmark, BookmarkCheck,
  Highlighter, X, Check, Volume2, VolumeX, ArrowLeft,
  CheckCircle2, Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { bibleService } from '@/services/api/bible.service';
import { Book, Chapter, Verse } from '@/services/types/bible.types';
import { useReaderStore } from '@/store/readerStore';
import { useAudio } from '@/hooks/useAudio';
import { Loader } from '@/components/common/Loader';
import type { HighlightColor, Highlight } from '@/services/types/bible.types.extended';

// ─── Highlight color palette ──────────────────────────────────────────────────
const HIGHLIGHT_COLORS: { color: HighlightColor; bg: string; border: string; ring: string }[] = [
  { color: 'yellow',  bg: 'bg-yellow-200',  border: 'border-yellow-400',  ring: 'ring-yellow-400' },
  { color: 'green',   bg: 'bg-green-200',   border: 'border-green-400',   ring: 'ring-green-400' },
  { color: 'blue',    bg: 'bg-blue-200',    border: 'border-blue-400',    ring: 'ring-blue-400' },
  { color: 'pink',    bg: 'bg-pink-200',    border: 'border-pink-400',    ring: 'ring-pink-400' },
  { color: 'orange',  bg: 'bg-orange-200',  border: 'border-orange-400',  ring: 'ring-orange-400' },
];

const getHighlightBg = (color: HighlightColor) =>
  HIGHLIGHT_COLORS.find((c) => c.color === color)?.bg || 'bg-yellow-200';

// ─── Component ────────────────────────────────────────────────────────────────
export const Reader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL params: ?book=1&chapter=1
  const initialBookId = searchParams.get('book') ? Number(searchParams.get('book')) : null;
  const initialChapter = searchParams.get('chapter') ? Number(searchParams.get('chapter')) : null;

  // ── State ───────────────────────────────────────────────────────────────────
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'books' | 'chapters' | 'reading'>('books');

  // Highlight interaction
  const [highlightMode, setHighlightMode] = useState(false);
  const [activeHighlightColor, setActiveHighlightColor] = useState<HighlightColor>('yellow');
  const [selectedVerse, setSelectedVerse] = useState<{ verse: Verse; highlight?: Highlight } | null>(null);
  const [highlightNote, setHighlightNote] = useState('');
  const [audioOpen, setAudioOpen] = useState(false);

  // ── Store ───────────────────────────────────────────────────────────────────
  const {
    getHighlightsForVerse, addHighlight, removeHighlight,
    updateHighlightColor, updateHighlightNote,
    isBookmarked, toggleBookmark,
    updateLastRead, markChapterComplete,
    getReadingProgress,
  } = useReaderStore();

  // ── Audio ───────────────────────────────────────────────────────────────────
  const audio = useAudio(verses);

  // ── Load books on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data: any = await bibleService.getBooks();
        // L'API retourne { count, next, previous, results: [...] }
        const list = Array.isArray(data) ? data : (data.results || []);
        setBooks(list);

        // If URL has book param, auto-navigate
        if (initialBookId) {
          const book = list.find((b: any) => b.id === initialBookId);
          if (book) {
            setSelectedBook(book);
            setView('chapters');
            await loadChapters(book.id);
          }
        }
      } catch (e) {
        console.error('Error loading books:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-navigate to chapter from URL ───────────────────────────────────────
  useEffect(() => {
    if (initialChapter && chapters.length > 0 && selectedBook) {
      const ch = chapters.find((c: any) => c.number === initialChapter);
      if (ch) {
        setSelectedChapter(ch);
        setView('reading');
        loadVerses(selectedBook.id, ch.id);
      }
    }
  }, [chapters]);

  // ── Load chapters ───────────────────────────────────────────────────────────
  const loadChapters = async (bookId: number) => {
    setLoading(true);
    try {
      const data: any = await bibleService.getChapters(bookId);
      const list = Array.isArray(data) ? data : (data.results || []);
      setChapters(list);
    } catch (e) {
      console.error('Error loading chapters:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Load verses ─────────────────────────────────────────────────────────────
  const loadVerses = async (bookId: number, chapterId: number) => {
    setLoading(true);
    try {
      const data: any = await bibleService.getVerses(bookId, chapterId);
      const list = Array.isArray(data) ? data : (data.results || []);
      setVerses(list);
    } catch (e) {
      console.error('Error loading verses:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation handlers ─────────────────────────────────────────────────────
  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setView('chapters');
    loadChapters(book.id);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setView('reading');
    if (selectedBook) {
      loadVerses(selectedBook.id, chapter.id);
    }
  };

  const goBack = () => {
    audio.stop();
    if (view === 'reading') {
      setVerses([]);
      setSelectedChapter(null);
      setView('chapters');
    } else if (view === 'chapters') {
      setChapters([]);
      setSelectedBook(null);
      setView('books');
    }
  };

  // Navigate chapters
  const prevChapter = () => {
    if (!selectedBook || !selectedChapter) return;
    const idx = chapters.findIndex((c) => c.id === selectedChapter.id);
    if (idx > 0) handleChapterSelect(chapters[idx - 1]);
  };

  const nextChapter = () => {
    if (!selectedBook || !selectedChapter) return;
    const idx = chapters.findIndex((c) => c.id === selectedChapter.id);
    if (idx < chapters.length - 1) handleChapterSelect(chapters[idx + 1]);
  };

  // ── Track reading progress (when verse scrolls into view) ───────────────────
  const trackProgress = useCallback(
    (verseIndex: number) => {
      if (!selectedBook || !selectedChapter) return;
      const verse = verses[verseIndex];
      if (!verse) return;
      updateLastRead(
        selectedBook.id,
        selectedBook.name,
        (selectedChapter as any).number,
        (verse as any).number,
        (selectedBook as any).chapter_count
      );
    },
    [selectedBook, selectedChapter, verses, updateLastRead]
  );

  // ── Highlight / Bookmark handlers ───────────────────────────────────────────
  const handleVerseClick = (verse: Verse) => {
    if (!highlightMode || !selectedBook || !selectedChapter) return;
    const existing = getHighlightsForVerse(verse.id);
    setSelectedVerse({ verse, highlight: existing[0] });
    setHighlightNote(existing[0]?.note || '');
  };

  const confirmHighlight = () => {
    if (!selectedVerse || !selectedBook || !selectedChapter) return;
    const existing = getHighlightsForVerse(selectedVerse.verse.id);

    if (existing.length > 0) {
      // Update existing
      updateHighlightColor(existing[0].id, activeHighlightColor);
      if (highlightNote) updateHighlightNote(existing[0].id, highlightNote);
    } else {
      // Create new
      addHighlight({
        verseId: selectedVerse.verse.id,
        bookId: selectedBook.id,
        chapterId: selectedChapter.id,
        color: activeHighlightColor,
        note: highlightNote || undefined,
      });
    }
    setSelectedVerse(null);
    setHighlightNote('');
  };

  const removeCurrentHighlight = () => {
    if (!selectedVerse) return;
    const existing = getHighlightsForVerse(selectedVerse.verse.id);
    if (existing.length > 0) removeHighlight(existing[0].id);
    setSelectedVerse(null);
    setHighlightNote('');
  };

  const handleBookmarkToggle = (verse: Verse) => {
    if (!selectedBook || !selectedChapter) return;
    toggleBookmark({
      verseId: verse.id,
      bookId: selectedBook.id,
      chapterId: selectedChapter.id,
      bookName: selectedBook.name,
      chapterNumber: (selectedChapter as any).number,
      verseNumber: (verse as any).number,
    });
  };

  const markComplete = () => {
    if (!selectedBook || !selectedChapter) return;
    markChapterComplete(
      selectedBook.id,
      selectedBook.name,
      (selectedChapter as any).number,
      (selectedBook as any).chapter_count
    );
  };

  // ─── Render: Book List ──────────────────────────────────────────────────────
  const renderBooks = () => {
    const oldTestament = books.filter((b) => b.testament === 'OT');
    const newTestament = books.filter((b) => b.testament === 'NT');

    return (
      <div className="max-w-2xl mx-auto">
        {['OT', 'NT'].map((testament) => {
          const list = testament === 'OT' ? oldTestament : newTestament;
          const label = testament === 'OT' ? 'Ancien Testament' : 'Nouveau Testament';
          return (
            <div key={testament} className="mb-8">
              <h2 className="font-display text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 px-1">
                {label}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {list.map((book, i) => {
                  const progress = getReadingProgress(book.id);
                  const pct = progress
                    ? Math.round((progress.completedChapters.length / (book as any).chapter_count) * 100)
                    : 0;

                  return (
                    <motion.button
                      key={book.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleBookSelect(book)}
                      className="relative text-left p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-md transition-all duration-200 group"
                    >
                      <p className="font-semibold text-gray-800 dark:text-white text-sm group-hover:text-primary transition-colors">
                        {book.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {(book as any).chapter_count} ch.
                      </p>
                      {/* Progress bar */}
                      {pct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-slate-700 rounded-b-xl overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-r"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Render: Chapter List ───────────────────────────────────────────────────
  const renderChapters = () => {
    const progress = selectedBook ? getReadingProgress(selectedBook.id) : null;

    return (
      <div className="max-w-2xl mx-auto">
        {progress && (
          <Card className="mb-6">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progression</span>
                <span className="text-sm font-semibold text-primary">
                  {progress.completedChapters.length} / {(selectedBook as any)?.chapter_count} ch.
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${(progress.completedChapters.length / ((selectedBook as any)?.chapter_count || 1)) * 100}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {chapters.map((chapter, i) => {
            const isCompleted = progress?.completedChapters.includes((chapter as any).number);
            const isLastRead = progress?.lastReadChapter === (chapter as any).number;

            return (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleChapterSelect(chapter)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 group
                  ${isCompleted
                    ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                    : isLastRead
                    ? 'border-primary bg-white dark:bg-slate-800 shadow-md'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-md'
                  }`}
              >
                {isCompleted && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary absolute top-1 right-1" />
                )}
                <span className={`text-sm font-semibold transition-colors ${isCompleted ? 'text-primary' : 'text-gray-700 dark:text-white group-hover:text-primary'}`}>
                  {(chapter as any).number}
                </span>
                {isLastRead && !isCompleted && (
                  <span className="text-xs text-primary font-medium">←</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Render: Reading View ───────────────────────────────────────────────────
  const renderReading = () => {
    const chapterIdx = chapters.findIndex((c) => c.id === selectedChapter?.id);
    const hasPrev = chapterIdx > 0;
    const hasNext = chapterIdx < chapters.length - 1;
    const progress = selectedBook ? getReadingProgress(selectedBook.id) : null;
    const isChapterDone = progress?.completedChapters.includes((selectedChapter as any)?.number || 0);

    return (
      <div className="max-w-2xl mx-auto">
        {/* Chapter nav bar */}
        <div className="flex items-center justify-between mb-6 sticky top-20 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur py-2 -mx-2 px-2">
          <button
            onClick={prevChapter}
            disabled={!hasPrev}
            className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              {selectedBook?.name}
            </p>
            <p className="font-display text-lg font-bold text-gray-800 dark:text-white">
              Chapitre {(selectedChapter as any)?.number}
            </p>
          </div>

          <button
            onClick={nextChapter}
            disabled={!hasNext}
            className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightMode(!highlightMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${highlightMode
                  ? 'bg-primary text-white shadow-md'
                  : 'border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-primary'
                }`}
            >
              <Highlighter className="h-3.5 w-3.5" />
              Souligner
            </button>

            {highlightMode && (
              <div className="flex items-center gap-1 ml-2">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setActiveHighlightColor(c.color)}
                    className={`w-5 h-5 rounded-full ${c.bg} border-2 transition-all ${
                      activeHighlightColor === c.color
                        ? `${c.border} ring-2 ${c.ring} scale-110`
                        : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioOpen(!audioOpen)}
              className={`p-2 rounded-lg transition-colors ${
                audioOpen ? 'bg-primary text-white' : 'border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-primary'
              }`}
            >
              {audioOpen ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={markComplete}
              disabled={!!isChapterDone}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${isChapterDone
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600'
                }`}
            >
              {isChapterDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
              {isChapterDone ? 'Terminé' : 'Marquer terminé'}
            </button>
          </div>
        </div>

        {/* Audio player panel */}
        <AnimatePresence>
          {audioOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="mb-4 border-primary/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={audio.prev} className="p-1 text-gray-500 hover:text-primary transition-colors">
                        <SkipBack className="h-4 w-4" />
                      </button>
                      <button
                        onClick={audio.togglePlay}
                        className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 shadow-md transition-all active:scale-95"
                      >
                        {audio.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </button>
                      <button onClick={audio.next} className="p-1 text-gray-500 hover:text-primary transition-colors">
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Vitesse :</span>
                      {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                        <button
                          key={r}
                          onClick={() => audio.setRate(r)}
                          className={`text-xs px-2 py-0.5 rounded transition-colors ${
                            audio.rate === r
                              ? 'bg-primary text-white'
                              : 'text-gray-500 hover:text-primary'
                          }`}
                        >
                          {r}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-primary font-semibold">
                      v.{(verses[audio.currentVerseIndex] as any)?.number || 1}
                    </span>
                    <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${((audio.currentVerseIndex + 1) / verses.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{verses.length} v.</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verses */}
        <div className="space-y-1">
          {verses.map((verse, idx) => {
            const highlights = getHighlightsForVerse(verse.id);
            const hasHighlight = highlights.length > 0;
            const bookmarked = isBookmarked(verse.id);
            const isCurrentAudio = audio.currentVerseIndex === idx;

            return (
              <motion.div
                key={verse.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => {
                  trackProgress(idx);
                  handleVerseClick(verse);
                }}
                ref={(el) => {
                  // Auto-scroll to audio verse
                  if (isCurrentAudio && el && audio.isPlaying) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`relative group flex gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer
                  ${isCurrentAudio && audio.isPlaying
                    ? 'bg-primary/8 ring-1 ring-primary/30'
                    : hasHighlight
                    ? `${getHighlightBg(highlights[0].color)} bg-opacity-40`
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                  }
                  ${highlightMode ? 'hover:ring-2 hover:ring-primary/40' : ''}
                `}
              >
                {/* Verse number */}
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-0.5 min-w-[1.5rem] text-right flex-shrink-0">
                  {(verse as any).number}
                </span>

                {/* Verse text */}
                <p className={`text-base leading-relaxed ${hasHighlight ? 'text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}>
                  {verse.text}
                </p>

                {/* Action icons (appear on hover) */}
                <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Bookmark toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkToggle(verse);
                    }}
                    className={`p-1 rounded transition-colors ${bookmarked ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                  >
                    {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Highlight dot indicator */}
                {hasHighlight && (
                  <div className={`absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${getHighlightBg(highlights[0].color)}`} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite via-white to-primary/5 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {view !== 'books' && (
            <button
              onClick={goBack}
              className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {view === 'books' && 'Livres de la Bible'}
              {view === 'chapters' && selectedBook?.name}
              {view === 'reading' && `${selectedBook?.name} — Ch. ${(selectedChapter as any)?.number}`}
            </h1>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader spiritual text="Chargement..." />
          </div>
        ) : (
          <>
            {view === 'books' && renderBooks()}
            {view === 'chapters' && renderChapters()}
            {view === 'reading' && renderReading()}
          </>
        )}
      </div>

      {/* ── Highlight confirmation popover ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedVerse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => { setSelectedVerse(null); setHighlightNote(''); }}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-gray-800 dark:text-white">
                  {getHighlightsForVerse(selectedVerse.verse.id).length > 0 ? 'Modifier le soulignement' : 'Souligner ce verset'}
                </h3>
                <button
                  onClick={() => { setSelectedVerse(null); setHighlightNote(''); }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Verse preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4 line-clamp-3">
                "{selectedVerse.verse.text}"
              </p>

              {/* Color picker */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Couleur</p>
                <div className="flex gap-2">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setActiveHighlightColor(c.color)}
                      className={`w-7 h-7 rounded-full ${c.bg} border-2 transition-all ${
                        activeHighlightColor === c.color
                          ? `${c.border} ring-2 ${c.ring} scale-110`
                          : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Note input */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Note (optionnelle)</p>
                <textarea
                  value={highlightNote}
                  onChange={(e) => setHighlightNote(e.target.value)}
                  placeholder="Ajoutez une note..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                {getHighlightsForVerse(selectedVerse.verse.id).length > 0 && (
                  <button
                    onClick={removeCurrentHighlight}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Supprimer
                  </button>
                )}
                <div className="ml-auto">
                  <Button onClick={confirmHighlight} size="sm">
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    {getHighlightsForVerse(selectedVerse.verse.id).length > 0 ? 'Mettre à jour' : 'Souligner'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};