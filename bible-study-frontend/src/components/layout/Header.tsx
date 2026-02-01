import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:bg-slate-900/95 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-display text-xl font-bold text-primary">
              Bible IA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300"
                >
                  Accueil
                </Link>
                <Link
                  to="/ask"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300"
                >
                  Poser une question
                </Link>

                {/* ── NEW: Lecture section with dropdown ── */}
                <div className="relative group">
                  <Link
                    to="/reader"
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300"
                  >
                    Lecture
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <Link
                      to="/reader"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      Livres de la Bible
                    </Link>
                    <Link
                      to="/bookmarks"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      Signets
                    </Link>
                    <Link
                      to="/highlights"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      Soulignements
                    </Link>
                  </div>
                </div>
                {/* ── END NEW ── */}

                <Link
                  to="/favorites"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300"
                >
                  Favoris
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-300"
                >
                  {user?.first_name || 'Profil'}
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Inscription</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-800"
          >
            <nav className="container mx-auto px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/ask"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Poser une question
                  </Link>

                  {/* ── NEW: Lecture group ── */}
                  <div className="border-t border-gray-100 dark:border-slate-700 pt-2 mt-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
                      Lecture
                    </p>
                    <Link
                      to="/reader"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 pl-3 text-gray-700 hover:text-primary dark:text-gray-300"
                    >
                      Livres de la Bible
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 pl-3 text-gray-700 hover:text-primary dark:text-gray-300"
                    >
                      Signets
                    </Link>
                    <Link
                      to="/highlights"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 pl-3 text-gray-700 hover:text-primary dark:text-gray-300"
                    >
                      Soulignements
                    </Link>
                  </div>
                  {/* ── END NEW ── */}

                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Favoris
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Profil
                  </Link>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};