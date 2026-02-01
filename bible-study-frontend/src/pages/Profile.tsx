import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Moon, Sun, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { verses, conversations } = useFavorites();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [spiritualGoal, setSpiritualGoal] = useState(
    localStorage.getItem('spiritual_goal') || ''
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  const handleSaveGoal = () => {
    localStorage.setItem('spiritual_goal', spiritualGoal);
    alert('Objectif spirituel sauvegardé !');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalSaved = verses.length + conversations.length;
  const joinDate = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-offwhite to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {user?.first_name || 'Mon Profil'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{user?.email}</p>
            {joinDate && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Membre depuis le {joinDate}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-3xl font-bold text-primary mb-1">{conversations.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Questions posées</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-3xl font-bold text-accent mb-1">{verses.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Versets sauvés</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg col-span-2 md:col-span-1">
                    <p className="text-3xl font-bold text-secondary mb-1">{totalSaved}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total favoris</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-green-600" />
                  Mon objectif spirituel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={spiritualGoal}
                  onChange={(e) => setSpiritualGoal(e.target.value)}
                  placeholder="Décrivez votre objectif spirituel personnel..."
                  rows={4}
                  className="mb-4"
                />
                <Button onClick={handleSaveGoal} variant="secondary">
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? (
                        <Moon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Sun className="h-5 w-5 text-amber-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Mode sombre
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Activez le thème sombre pour plus de confort
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <Input value={user?.email || ''} disabled />
                  </div>

                  {/* Name (read-only for now) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prénom
                    </label>
                    <Input value={user?.first_name || ''} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                {!showLogoutConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                      Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="flex-1"
                      >
                        Confirmer
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
