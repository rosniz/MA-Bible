import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, MessageCircle, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

type TabType = 'all' | 'verses' | 'conversations';

export const Favorites = () => {
  const navigate = useNavigate();
  const { verses, conversations, removeVerse, removeConversation } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVerses = verses.filter((verse) =>
    verse.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showVerses = activeTab === 'all' || activeTab === 'verses';
  const showConversations = activeTab === 'all' || activeTab === 'conversations';

  const hasNoFavorites = verses.length === 0 && conversations.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <Heart className="h-8 w-8 text-red-600 fill-current" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Mes favoris
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Retrouvez vos versets et réflexions sauvegardés
            </p>
          </div>

          {hasNoFavorites ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Aucun favori pour le moment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Commencez à sauvegarder vos versets et réflexions préférés pour les retrouver facilement
              </p>
              <Button onClick={() => navigate('/ask')} size="lg">
                Poser une question
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                >
                  Tout ({verses.length + conversations.length})
                </Button>
                <Button
                  variant={activeTab === 'verses' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('verses')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Versets ({verses.length})
                </Button>
                <Button
                  variant={activeTab === 'conversations' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('conversations')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Questions ({conversations.length})
                </Button>
              </div>

              {/* Search */}
              <div className="max-w-xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations */}
              {showConversations && filteredConversations.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <MessageCircle className="mr-2 h-6 w-6 text-primary" />
                    Questions sauvegardées
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredConversations.map((conv, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <CardTitle className="text-lg line-clamp-2">
                                {conv.question}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeConversation(conv.question)}
                                className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                              {conv.summary}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('/answer', { state: { answer: conv } })}
                            >
                              Voir la réponse complète
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verses */}
              {showVerses && filteredVerses.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-secondary" />
                    Versets sauvegardés
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredVerses.map((verse, index) => (
                      <motion.div
                        key={verse.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <Badge variant="secondary" className="shrink-0">
                                {verse.reference || `${verse.book_name} ${verse.verse_number}`}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeVerse(verse.id)}
                                className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="font-verse text-base text-gray-700 dark:text-gray-300 italic leading-relaxed">
                              "{verse.text}"
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery &&
                filteredVerses.length === 0 &&
                filteredConversations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun résultat trouvé pour "{searchQuery}"
                    </p>
                  </div>
                )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
