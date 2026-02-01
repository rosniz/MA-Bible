import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { questionSchema, type QuestionFormData } from '@/utils/validators';
import { useAI } from '@/hooks/useAI';
import { SPIRITUAL_THEMES } from '@/utils/constants';

export const Ask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { askQuestion, isLoading, error } = useAI();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: '',
    },
  });

  const questionValue = watch('question');

  useEffect(() => {
    setCharCount(questionValue?.length || 0);
  }, [questionValue]);

  useEffect(() => {
    if (location.state?.theme) {
      setSelectedTheme(location.state.theme);
      setValue('question', `Comment la Bible aborde-t-elle le thème de ${location.state.theme.toLowerCase()} ?`);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const response = await askQuestion(data.question);
      // Navigate to answer page with the response
      navigate('/answer', { state: { answer: response } });
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Posez votre question
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              L'IA vous guidera vers la sagesse biblique
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Themes */}
              {selectedTheme && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Thème :</span>
                  <Badge variant="default">{selectedTheme}</Badge>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTheme(null);
                      setValue('question', '');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Supprimer
                  </button>
                </div>
              )}

              {/* Question Input */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Votre question spirituelle
                </label>
                <Textarea
                  id="question"
                  rows={6}
                  placeholder="Par exemple : Comment puis-je trouver la paix intérieure dans les moments difficiles ?"
                  {...register('question')}
                  autoFocus
                />
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {errors.question && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.question.message}</p>
                    )}
                  </div>
                  <p className={`text-xs ${charCount > 500 ? 'text-red-600' : 'text-gray-500'} dark:text-gray-400`}>
                    {charCount} / 500
                  </p>
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ou choisissez un thème (optionnel)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPIRITUAL_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(theme.name);
                        setValue('question', `Comment la Bible aborde-t-elle le thème de ${theme.name.toLowerCase()} ?`);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTheme === theme.name
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    Méditation en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Obtenir une réponse
                  </span>
                )}
              </Button>
            </form>

            {/* Info Text */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Conseil :</strong> Soyez précis dans votre question pour obtenir une réponse plus pertinente et approfondie.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
