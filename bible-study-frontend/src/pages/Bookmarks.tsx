import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useReaderStore } from '@/store/readerStore';

export const Bookmarks = () => {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark } = useReaderStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleNavigate = (bm: typeof bookmarks[0]) => {
    navigate(`/reader?book=${bm.bookId}&chapter=${bm.chapterNumber}`);
  };

  // Group bookmarks by book
  const grouped = bookmarks.reduce<Record<string, typeof bookmarks>>((acc, bm) => {
    const key = bm.bookName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(bm);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite via-white to-primary/5 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BookmarkCheck className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            Mes Signets
          </h1>
          <span className="text-sm text-gray-400 ml-auto">
            {bookmarks.length} signet{bookmarks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Bookmark className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucun signet pour le moment.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Ajoutez des signets pendant votre lecture pour les retrouver ici.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([bookName, items], gIdx) => (
              <motion.div
                key={bookName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gIdx * 0.08 }}
              >
                <h2 className="font-display text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                  {bookName}
                </h2>
                <div className="space-y-2">
                  {items.map((bm, i) => (
                    <motion.div
                      key={bm.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gIdx * 0.08 + i * 0.04 }}
                    >
                      <Card className="group hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-primary">
                                  Ch. {bm.chapterNumber} : {bm.verseNumber}
                                </span>
                              </div>
                              {bm.note && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1 line-clamp-2">
                                  "{bm.note}"
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => handleNavigate(bm)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                title="Aller au verset"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </button>

                              {confirmDelete === bm.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => { removeBookmark(bm.id); setConfirmDelete(null); }}
                                    className="px-2 py-0.5 rounded text-xs bg-red-500 text-white hover:bg-red-600 transition-colors"
                                  >
                                    Oui
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-0.5 rounded text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(bm.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};