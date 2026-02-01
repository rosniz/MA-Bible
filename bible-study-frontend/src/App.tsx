import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Loader } from '@/components/common/Loader';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Ask = lazy(() => import('@/pages/Ask').then(m => ({ default: m.Ask })));
const Answer = lazy(() => import('@/pages/Answer').then(m => ({ default: m.Answer })));
const Favorites = lazy(() => import('@/pages/Favorites').then(m => ({ default: m.Favorites })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/Register').then(m => ({ default: m.Register })));

// ── NEW: Bible Reader pages ──────────────────────────────────────────────────
const Reader = lazy(() => import('@/pages/Reader').then(m => ({ default: m.Reader })));
const Bookmarks = lazy(() => import('@/pages/Bookmarks').then(m => ({ default: m.Bookmarks })));
const Highlights = lazy(() => import('@/pages/Highlights').then(m => ({ default: m.Highlights })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-slate-900">
          <Header />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loader spiritual />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ask"
                element={
                  <ProtectedRoute>
                    <Ask />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/answer"
                element={
                  <ProtectedRoute>
                    <Answer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* ── NEW: Bible Reader Routes ──────────────────────────────────── */}
              <Route
                path="/reader"
                element={
                  <ProtectedRoute>
                    <Reader />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/highlights"
                element={
                  <ProtectedRoute>
                    <Highlights />
                  </ProtectedRoute>
                }
              />
              {/* ── END NEW ──────────────────────────────────────────────────── */}

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;