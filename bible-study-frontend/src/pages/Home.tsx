import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { bibleService } from '@/services/api/bible.service';
import { Verse } from '@/services/types/bible.types';
import { SPIRITUAL_THEMES, INSPIRATIONAL_PLACEHOLDERS } from '@/utils/constants';
import { Loader } from '@/components/common/Loader';
import { useReaderStore } from '@/store/readerStore'; // ← NEW import

export const Home = () => {
  const navigate = useNavigate();
  const [verseOfTheDay, setVerseOfTheDay] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState('');

  // ── NEW: reading progress for "Continue reading" widget ────────────────────
  const readingProgress = useReaderStore((s) => s.readingProgress);

  // Find the most recently read book
  const lastRead = Object.values(readingProgress).sort(
    (a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
  )[0] || null;

  useEffect(() => {
    const loadVerseOfTheDay = async () => {
      try {
        const verse = await bibleService.getRandomVerse();
        setVerseOfTheDay(verse);
      } catch (error) {
        console.error('Error loading verse:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVerseOfTheDay();
    
    // Random placeholder
    const randomPlaceholder = INSPIRATIONAL_PLACEHOLDERS[
      Math.floor(Math.random() * INSPIRATIONAL_PLACEHOLDERS.length)
    ];
    setPlaceholder(randomPlaceholder);
  }, []);

  const handleThemeClick = (themeName: string) => {
    navigate('/ask', { state: { theme: themeName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite via-white to-primary/5 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section with Verse of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-secondary animate-pulse-soft" />
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Votre guide spirituel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Découvrez la sagesse biblique avec l'intelligence artificielle
          </p>

          {/* Verse of the Day */}
          {loading ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <Loader spiritual text="Chargement du verset du jour..." />
              </CardContent>
            </Card>
          ) : verseOfTheDay ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="max-w-2xl mx-auto bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-slate-700 border-2 border-primary/20">
                <CardContent className="pt-8 pb-8">
                  <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-4">
                    Verset du jour
                  </p>
                  <p className="font-verse text-2xl md:text-3xl text-gray-800 dark:text-gray-200 leading-relaxed mb-4 italic">
                    "{verseOfTheDay.text}"
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {verseOfTheDay.reference || `${verseOfTheDay.book_name} ${verseOfTheDay.verse_number}`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </motion.div>

        {/* Question Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="relative">
            <button
              onClick={() => navigate('/ask')}
              className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl px-6 py-6 text-left hover:border-primary hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <Search className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-lg text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {placeholder}
                </span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* ── NEW: Continue Reading widget ──────────────────────────────────── */}
        {lastRead && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <button
              onClick={() => navigate(`/reader?book=${lastRead.bookId}&chapter=${lastRead.lastReadChapter}`)}
              className="w-full text-left group"
            >
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-white to-primary/5 dark:from-slate-800 dark:to-slate-700 hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-0.5">
                          Reprendre la lecture
                        </p>
                        <p className="font-display font-bold text-gray-800 dark:text-white">
                          {lastRead.bookName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Chapitre {lastRead.lastReadChapter}
                          {lastRead.lastReadVerse > 0 && ` · Verset ${lastRead.lastReadVerse}`}
                          <span className="mx-2 text-gray-300">·</span>
                          {lastRead.completedChapters.length}/{lastRead.totalChapters} ch. terminés
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(lastRead.completedChapters.length / lastRead.totalChapters) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          </motion.div>
        )}
        {/* ── END NEW ── */}

        {/* Spiritual Themes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-display text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Thèmes spirituels
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SPIRITUAL_THEMES.map((theme, index) => {
              const Icon = theme.icon;
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => handleThemeClick(theme.name)}
                    className={`w-full p-6 rounded-xl border-2 border-gray-200 dark:border-slate-700 ${theme.bgColor} dark:bg-slate-800 hover:shadow-lg transition-all duration-300 group`}
                  >
                    <Icon className={`h-8 w-8 ${theme.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {theme.name}
                    </p>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <Button
            onClick={() => navigate('/ask')}
            size="lg"
            className="px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Poser ma question
          </Button>
        </motion.div>
      </div>
    </div>
  );
};