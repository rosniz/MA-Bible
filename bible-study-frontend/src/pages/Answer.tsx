import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Sparkles, BookOpen, Lightbulb, Target, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AIResponse } from '@/services/types/ai.types';
import { useFavorites } from '@/hooks/useFavorites';

export const Answer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addConversation, isConversationSaved, removeConversation } = useFavorites();
  const [answer, setAnswer] = useState<AIResponse | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const answerFromState = location.state?.answer;
    if (!answerFromState) {
      navigate('/ask');
      return;
    }
    setAnswer(answerFromState);
    setIsSaved(isConversationSaved(answerFromState.question));
  }, [location.state, navigate, isConversationSaved]);

  const handleSave = () => {
    if (!answer) return;
    
    if (isSaved) {
      removeConversation(answer.question);
      setIsSaved(false);
    } else {
      addConversation(answer);
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    if (!answer) return;
    
    const shareText = `Question: ${answer.question}\n\nRéponse: ${answer.summary}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma réflexion spirituelle',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Copié dans le presse-papiers !');
    }
  };

  if (!answer) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="default" className="text-sm">
                <Sparkles className="mr-1 h-3 w-3" />
                Réponse IA
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className={isSaved ? 'text-red-600 border-red-600' : ''}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {answer.question}
            </h1>
          </motion.div>

          {/* Summary */}
          <motion.div variants={itemVariants}>
            <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Résumé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {answer.summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verses */}
          {answer.verses && answer.verses.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-secondary" />
                Versets bibliques
              </h2>
              <div className="space-y-4">
                {answer.verses.map((verse, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <p className="font-verse text-lg text-gray-800 dark:text-gray-200 italic mb-3 leading-relaxed">
                          "{verse.text}"
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {verse.reference}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Explanation */}
          {answer.explanation && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Lightbulb className="mr-2 h-5 w-5 text-accent" />
                    Explication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {answer.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Application */}
          {answer.application && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800 dark:text-green-300">
                    <Target className="mr-2 h-5 w-5" />
                    Application pratique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {answer.application}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Prayer */}
          {answer.prayer && (
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800 dark:text-purple-300">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Prière suggérée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-verse text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed whitespace-pre-wrap">
                    {answer.prayer}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={() => navigate('/ask')} size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Nouvelle question
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/favorites')}>
              <Heart className="mr-2 h-5 w-5" />
              Voir mes favoris
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
