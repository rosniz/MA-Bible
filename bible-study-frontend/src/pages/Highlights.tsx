import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Highlighter, ArrowRight, Trash2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useReaderStore } from '@/store/readerStore';
import type { HighlightColor, Highlight } from '@/services/types/bible.types.extended';

// ─── Color config ─────────────────────────────────────────────────────────────
const COLOR_MAP: Record<HighlightColor, { bg: string; label: string; dot: string }> = {
  yellow:  { bg: 'bg-yellow-200',  label: 'Jaune',   dot: 'bg-yellow-400' },
  green:   { bg: 'bg-green-200',   label: 'Vert',    dot: 'bg-green-400' },
  blue:    { bg: 'bg-blue-200',    label: 'Bleu',    dot: 'bg-blue-400' },
  pink:    { bg: 'bg-pink-200',    label: 'Rose',    dot: 'bg-pink-400' },
  orange:  { bg: 'bg-orange-200',  label: 'Orange',  dot: 'bg-orange-400' },
};

export const Highlights = () => {
  const navigate = useNavigate();
  const { highlights, removeHighlight } = useReaderStore();
  const [filterColor, setFilterColor] = useState<HighlightColor | 'all'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filter
  const filtered = filterColor === 'all'
    ? highlights
    : highlights.filter((h) => h.color === filterColor);

  // Group by bookId
  const grouped = filtered.reduce<Record<number, Highlight[]>>((acc, h) => {
    if (!acc[h.bookId]) acc[h.bookId] = [];
    acc[h.bookId].push(h);
    return acc;
  }, {});

  const handleNavigate = (h: Highlight) => {
    navigate(`/reader?book=${h.bookId}&chapter=${h.chapterId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite via-white to-primary/5 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Highlighter className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            Mes Soulignements
          </h1>
          <span className="text-sm text-gray-400 ml-auto">
            {highlights.length}
          </span>
        </div>

        {/* Color filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <button
            onClick={() => setFilterColor('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterColor === 'all'
                ? 'bg-primary text-white'
                : 'border border-gray-200 dark:border-slate-700 text-gray-500 hover:border-primary'
            }`}
          >
            Tous ({highlights.length})
          </button>
          {(['yellow', 'green', 'blue', 'pink', 'orange'] as HighlightColor[]).map((c) => {
            const count = highlights.filter((h) => h.color === c).length;
            if (count === 0) return null;
            return (
              <button
                key={c}
                onClick={() => setFilterColor(c)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterColor === c
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 dark:border-slate-700 text-gray-500 hover:border-primary'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${COLOR_MAP[c].dot}`} />
                {COLOR_MAP[c].label} ({count})
              </button>
            );
          })}
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Highlighter className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucun soulignement trouvé.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Utilisez l'outil "Souligner" pendant la lecture pour marquer des versets.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([bookIdStr, items], gIdx) => (
              <motion.div
                key={bookIdStr}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gIdx * 0.06 }}
              >
                <div className="space-y-2">
                  {items.map((h, i) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gIdx * 0.06 + i * 0.03 }}
                    >
                      <Card className={`group border-l-4 ${COLOR_MAP[h.color].bg.replace('bg-', 'border-').replace('200', '400')} hover:shadow-md transition-shadow`}>
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${COLOR_MAP[h.color].bg}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${COLOR_MAP[h.color].dot}`} />
                                  {COLOR_MAP[h.color].label}
                                </span>
                              </div>
                              {h.note && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1.5">
                                  Note : "{h.note}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(h.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button
                                onClick={() => handleNavigate(h)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                title="Aller au verset"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </button>

                              {confirmDelete === h.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => { removeHighlight(h.id); setConfirmDelete(null); }}
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
                                  onClick={() => setConfirmDelete(h.id)}
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