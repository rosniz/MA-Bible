# Bible Study App - Application d'étude biblique propulsée par l'IA

Une plateforme moderne et professionnelle pour l'étude biblique utilisant l'intelligence artificielle pour fournir des réponses spirituelles basées sur les Écritures.

## 🚀 Technologies

- **React 18+** avec TypeScript
- **Vite** (Build tool)
- **TailwindCSS** + shadcn/ui (Styling)
- **React Router v6** (Navigation)
- **Axios** (Requêtes HTTP)
- **Zustand** (State management)
- **React Query** (Cache API)
- **React Hook Form** + Zod (Validation)
- **Lucide React** (Icônes)
- **Framer Motion** (Animations)

## 📋 Prérequis

- Node.js 18+ et npm
- Backend Django en cours d'exécution sur `http://localhost:8000`

## 🛠️ Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configuration de l'environnement :**
   
   Le fichier `.env` est déjà configuré avec :
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **Lancer l'application en mode développement :**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:3000`

4. **Build pour la production :**
   ```bash
   npm run build
   ```

5. **Prévisualiser le build de production :**
   ```bash
   npm run preview
   ```

## 📁 Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants shadcn/ui (Button, Input, Card, etc.)
│   ├── layout/          # Header, Footer
│   └── common/          # Loader, ProtectedRoute
├── pages/               # Pages principales (Home, Ask, Answer, etc.)
├── services/
│   ├── api/             # Services API (auth, bible, ai, user)
│   └── types/           # Types TypeScript
├── store/               # Stores Zustand (auth, bible, favorites)
├── hooks/               # Hooks personnalisés
├── utils/               # Utilitaires et validateurs
├── App.tsx              # Composant racine avec routing
├── main.tsx             # Point d'entrée
└── index.css            # Styles globaux
```

## 🎨 Identité visuelle

- **Couleurs :**
  - Bleu nuit : `#1e3a8a` (Primary)
  - Or doux : `#d4af37` (Secondary)
  - Violet mystique : `#7c3aed` (Accent)
  - Blanc cassé : `#fafaf9`

- **Typographie :**
  - Playfair Display (Titres)
  - Inter (Corps de texte)
  - Crimson Pro (Versets bibliques)

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification :

- Les tokens sont stockés dans le localStorage
- Le refresh token est automatiquement géré
- Les routes sont protégées par le composant `ProtectedRoute`

## 📱 Fonctionnalités

### Pages publiques
- **Login** (`/login`) - Connexion utilisateur
- **Register** (`/register`) - Inscription

### Pages protégées (nécessitent une authentification)
- **Home** (`/`) - Verset du jour, thèmes spirituels
- **Ask** (`/ask`) - Poser une question spirituelle
- **Answer** (`/answer`) - Afficher la réponse de l'IA
- **Favorites** (`/favorites`) - Versets et questions sauvegardés
- **Profile** (`/profile`) - Profil utilisateur et paramètres

## 🔌 API Endpoints

### Authentication
- `POST /users/login/` - Connexion
- `POST /users/register/` - Inscription
- `POST /auth/token/refresh/` - Rafraîchir le token

### Users
- `GET /users/profile/` - Obtenir le profil
- `PATCH /users/profile/` - Mettre à jour le profil

### Bible
- `GET /bible/books/` - Liste des livres
- `GET /bible/chapters/?book={id}` - Chapitres d'un livre
- `GET /bible/verses/?chapter={id}` - Versets d'un chapitre
- `GET /bible/verses/search/?q={query}` - Rechercher des versets

### AI
- `POST /ai/ask/` - Poser une question à l'IA
- `GET /ai/conversations/` - Liste des conversations
- `GET /ai/conversations/{id}/` - Détails d'une conversation

## 💾 Stockage local

L'application utilise le localStorage pour :
- Les tokens d'authentification
- Les favoris (versets et conversations)
- Les objectifs spirituels
- Les préférences (mode sombre)

## 🎨 Mode sombre

Le mode sombre peut être activé depuis la page Profile. La préférence est sauvegardée dans le localStorage.

## 🔧 Développement

### Linting
```bash
npm run lint
```

### Structure des composants

Tous les composants utilisent TypeScript et sont organisés de manière modulaire :
- Composants UI réutilisables dans `components/ui/`
- Composants de layout dans `components/layout/`
- Composants métier dans les pages

### Gestion d'état

- **Zustand** pour l'état global (auth, bible, favorites)
- **React Query** pour le cache des requêtes API
- **React Hook Form** pour les formulaires

### Validation

Tous les formulaires utilisent Zod pour la validation des schémas.

## 🚨 Gestion des erreurs

- Les erreurs API sont capturées et affichées à l'utilisateur
- Les intercepteurs Axios gèrent automatiquement le refresh des tokens
- Les états de chargement sont affichés pour toutes les opérations asynchrones

## 📱 Responsive Design

L'application est entièrement responsive :
- Mobile-first approach
- Breakpoints Tailwind : sm, md, lg, xl
- Menu hamburger sur mobile
- Grilles adaptatives

## 🎭 Animations

Utilisation de Framer Motion pour :
- Transitions de page
- Animations séquentielles des versets
- Effets de hover
- États de chargement

## 📦 Build et déploiement

```bash
# Build de production
npm run build

# Le dossier dist/ contient les fichiers optimisés
```

## 🤝 Contribution

Cette application est conçue pour fonctionner avec le backend Django existant. Assurez-vous que le backend est en cours d'exécution avant de démarrer l'application frontend.

## 📄 Licence

Propriétaire

## 🙏 Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.

---

**Fait avec ❤️ pour la communauté spirituelle**
