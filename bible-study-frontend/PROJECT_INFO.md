# 📖 Bible Study App - Informations du projet

## 🎯 Vue d'ensemble

Application web moderne et professionnelle pour l'étude biblique propulsée par l'IA. Permet aux utilisateurs de poser des questions spirituelles et de recevoir des réponses basées sur les Écritures saintes.

## 📊 Statistiques du projet

- **Lignes de code** : ~3000+ lignes
- **Composants React** : 20+ composants
- **Pages** : 7 pages complètes
- **Services API** : 4 services
- **Stores Zustand** : 3 stores
- **Types TypeScript** : 100% typé
- **Responsive** : Mobile, Tablet, Desktop

## 🏗️ Architecture

### Frontend
- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : TailwindCSS avec design system custom
- **State Management** : Zustand
- **API Cache** : React Query
- **Routing** : React Router v6
- **Forms** : React Hook Form + Zod
- **Animations** : Framer Motion

### Backend (requis)
- **API REST Django** sur `http://localhost:8000/api/v1`
- **Authentication** : JWT (JSON Web Tokens)
- **Base de données** : Gérée par le backend Django

## 📁 Structure complète

```
bible-study-app/
├── public/                 # Assets statiques
├── src/
│   ├── components/
│   │   ├── ui/             # Composants UI réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/         # Composants de layout
│   │   │   └── Header.tsx
│   │   └── common/         # Composants communs
│   │       ├── Loader.tsx
│   │       └── ProtectedRoute.tsx
│   ├── pages/              # Pages de l'application
│   │   ├── Home.tsx        # Page d'accueil
│   │   ├── Ask.tsx         # Poser une question
│   │   ├── Answer.tsx      # Afficher la réponse
│   │   ├── Favorites.tsx   # Favoris sauvegardés
│   │   ├── Profile.tsx     # Profil utilisateur
│   │   ├── Login.tsx       # Connexion
│   │   └── Register.tsx    # Inscription
│   ├── services/
│   │   ├── api/            # Services API
│   │   │   ├── axios.config.ts    # Configuration Axios
│   │   │   ├── auth.service.ts    # Service d'authentification
│   │   │   ├── bible.service.ts   # Service Bible
│   │   │   ├── ai.service.ts      # Service IA
│   │   │   └── user.service.ts    # Service utilisateur
│   │   └── types/          # Types TypeScript
│   │       ├── auth.types.ts
│   │       ├── bible.types.ts
│   │       ├── ai.types.ts
│   │       └── user.types.ts
│   ├── store/              # Stores Zustand
│   │   ├── authStore.ts    # Store authentification
│   │   ├── bibleStore.ts   # Store Bible/IA
│   │   └── favoritesStore.ts # Store favoris
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useAuth.ts
│   │   ├── useAI.ts
│   │   └── useFavorites.ts
│   ├── utils/              # Utilitaires
│   │   ├── cn.ts           # Utilitaire classnames
│   │   ├── constants.ts    # Constantes
│   │   └── validators.ts   # Schémas de validation Zod
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── index.html              # Template HTML
├── package.json            # Dépendances
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── postcss.config.js       # Configuration PostCSS
├── .env                    # Variables d'environnement
├── .gitignore              # Fichiers ignorés par Git
├── install.sh              # Script d'installation
├── README.md               # Documentation principale
├── QUICKSTART.md           # Guide de démarrage rapide
├── COMMANDS.md             # Commandes disponibles
└── PROJECT_INFO.md         # Ce fichier

```

## 🎨 Design System

### Couleurs
```css
Primary (Bleu nuit)    : #1e3a8a
Secondary (Or doux)    : #d4af37
Accent (Violet)        : #7c3aed
Background (Blanc cassé): #fafaf9
```

### Typographie
- **Titres** : Playfair Display (serif, élégant)
- **Corps** : Inter (sans-serif, moderne)
- **Versets** : Crimson Pro (serif, lisible)

### Animations
- Fade in : 0.6s
- Slide up : 0.5s
- Pulse soft : 2s (infini)
- Scale in : 0.3s

## 🔐 Flux d'authentification

1. **Inscription** → POST /users/register/ → Sauvegarde token → Redirection /
2. **Connexion** → POST /users/login/ → Sauvegarde token → Redirection /
3. **Requête API** → Ajout Authorization header automatique
4. **Token expiré** → Refresh automatique → Retry de la requête
5. **Refresh échoué** → Déconnexion → Redirection /login

## 📊 Gestion d'état

### Store Auth (authStore.ts)
```typescript
{
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login(email, password)
  register(email, firstName, password)
  logout()
}
```

### Store Bible (bibleStore.ts)
```typescript
{
  currentQuestion: string
  currentAnswer: AIResponse | null
  isLoading: boolean
  error: string | null
  askQuestion(question)
  clearAnswer()
}
```

### Store Favorites (favoritesStore.ts)
```typescript
{
  verses: Verse[]
  conversations: AIResponse[]
  addVerse(verse)
  removeVerse(id)
  addConversation(conversation)
  removeConversation(question)
}
```

## 🌐 Endpoints API utilisés

### Authentification
- `POST /users/login/` - Connexion
- `POST /users/register/` - Inscription
- `POST /auth/token/refresh/` - Refresh token

### Utilisateur
- `GET /users/profile/` - Profil
- `PATCH /users/profile/` - Mise à jour profil

### Bible
- `GET /bible/books/` - Livres de la Bible
- `GET /bible/chapters/?book={id}` - Chapitres
- `GET /bible/verses/?chapter={id}` - Versets
- `GET /bible/verses/search/?q={query}` - Recherche

### IA
- `POST /ai/ask/` - Poser une question
- `GET /ai/conversations/` - Historique
- `GET /ai/conversations/{id}/` - Détails conversation

## 🎯 Fonctionnalités principales

### ✅ Implémenté
- [x] Authentification JWT complète
- [x] Auto-refresh des tokens
- [x] Verset du jour aléatoire
- [x] 8 thèmes spirituels prédéfinis
- [x] Poser des questions à l'IA
- [x] Réponses structurées avec versets
- [x] Système de favoris (localStorage)
- [x] Profil utilisateur
- [x] Mode sombre
- [x] Responsive design
- [x] Animations fluides
- [x] Protection des routes
- [x] Gestion d'erreurs
- [x] États de chargement
- [x] Validation des formulaires
- [x] Code splitting (lazy loading)

### 🚀 Optimisations
- React Query pour le cache API (staleTime: 5min)
- Lazy loading des pages
- Code splitting automatique (Vite)
- Bundle size optimisé
- Images optimisées
- Fonts préchargées

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Mobile large */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop large */
2xl: 1536px  /* Desktop XL */
```

## 🔧 Configuration

### Variables d'environnement (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Ports
- Frontend : `3000` (configurable dans vite.config.ts)
- Backend : `8000` (requis)

## 📦 Dépendances principales

### Production
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "axios": "^1.6.2",
  "zustand": "^4.4.7",
  "@tanstack/react-query": "^5.14.2",
  "react-hook-form": "^7.49.2",
  "zod": "^3.22.4",
  "framer-motion": "^10.16.16",
  "lucide-react": "^0.303.0"
}
```

### Développement
```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.2.2",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.55.0"
}
```

## 🧪 Tests

Les tests ne sont pas inclus dans cette version, mais peuvent être ajoutés avec :
- Vitest (test runner)
- React Testing Library (tests de composants)
- MSW (Mock Service Worker pour les API)

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Serveurs compatibles
- Vercel (recommandé)
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- Nginx / Apache

### Variables d'environnement en production
```
VITE_API_BASE_URL=https://votre-api-production.com/api/v1
```

## 🔒 Sécurité

- Tokens JWT stockés dans localStorage
- HTTPS recommandé en production
- CORS configuré sur le backend
- Validation côté client ET serveur
- Protection CSRF via Django
- Sanitization des inputs

## 📈 Performance

### Métriques cibles
- First Contentful Paint : < 1.5s
- Time to Interactive : < 3s
- Lighthouse Score : > 90

### Optimisations appliquées
- Code splitting par route
- Lazy loading des composants
- Compression des assets (Vite)
- Cache API (React Query)
- Debounce sur les inputs de recherche

## 🐛 Debugging

### Outils recommandés
- React DevTools (Chrome/Firefox)
- Redux DevTools (pour Zustand)
- Axios DevTools
- Network tab (DevTools)

### Logs utiles
```javascript
// Dans les stores Zustand
console.log('Auth state:', useAuthStore.getState());

// Dans les composants
console.log('Props:', props);
console.log('State:', state);
```

## 📚 Ressources

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation TailwindCSS](https://tailwindcss.com/)
- [Documentation Zustand](https://github.com/pmndrs/zustand)
- [Documentation React Query](https://tanstack.com/query)
- [Documentation Framer Motion](https://www.framer.com/motion/)

## 🤝 Contribution

Pour contribuer au projet :
1. Clonez le repository
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Changelog

### Version 1.0.0 (Initial Release)
- ✨ Authentification JWT complète
- ✨ Interface utilisateur moderne et responsive
- ✨ Intégration IA pour les questions spirituelles
- ✨ Système de favoris avec localStorage
- ✨ Mode sombre
- ✨ Animations fluides avec Framer Motion
- ✨ 7 pages complètes et fonctionnelles

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Auteurs

Développé avec ❤️ pour la communauté spirituelle

---

**Note** : Ce projet nécessite un backend Django fonctionnel pour être pleinement opérationnel. Assurez-vous que le backend est configuré et lancé avant de démarrer l'application frontend.

Pour toute question ou problème, consultez les fichiers README.md, QUICKSTART.md et COMMANDS.md.

🙏 Que votre parcours spirituel soit enrichissant !
