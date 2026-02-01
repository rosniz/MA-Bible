# Commandes disponibles

## Installation

```bash
# Installation automatique (recommandé)
./install.sh

# OU installation manuelle
npm install
```

## Développement

```bash
# Lancer le serveur de développement
npm run dev

# L'application sera accessible sur http://localhost:3000
```

## Build

```bash
# Créer un build de production
npm run build

# Les fichiers optimisés seront dans le dossier dist/
```

## Preview

```bash
# Prévisualiser le build de production
npm run preview
```

## Linting

```bash
# Vérifier le code avec ESLint
npm run lint
```

## Structure des commandes

- `npm run dev` : Démarre Vite en mode développement avec hot-reload
- `npm run build` : Compile TypeScript puis build avec Vite
- `npm run preview` : Sert le build de production localement
- `npm run lint` : Exécute ESLint sur tous les fichiers .ts et .tsx

## Variables d'environnement

Le fichier `.env` contient :

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Pour modifier l'URL de l'API, modifiez cette variable.

## Conseils de développement

### Hot Module Replacement (HMR)

Vite active automatiquement le HMR. Les modifications sont instantanément reflétées dans le navigateur sans rechargement complet de la page.

### TypeScript

Le projet utilise TypeScript en mode strict. Assurez-vous qu'il n'y a pas d'erreurs TypeScript avant de commiter :

```bash
npm run build
```

### Debugging

Pour déboguer l'application :

1. Ouvrez les DevTools de votre navigateur (F12)
2. Utilisez l'onglet "Sources" pour placer des breakpoints
3. Utilisez `console.log()` pour le debugging simple
4. Utilisez React DevTools pour inspecter les composants

### Performance

- Les pages sont lazy-loadées pour réduire le bundle initial
- React Query met en cache les requêtes API
- Les images et assets sont optimisés automatiquement par Vite

### Tests en local

Pour tester avec le backend Django :

1. Assurez-vous que le backend est lancé sur http://localhost:8000
2. Créez un compte utilisateur via /register
3. Connectez-vous via /login
4. Testez toutes les fonctionnalités

## Résolution de problèmes

### Port 3000 déjà utilisé

Modifiez le port dans `vite.config.ts` :

```typescript
server: { 
  port: 3001  // ou un autre port
}
```

### Erreurs CORS

Assurez-vous que le backend Django autorise les requêtes depuis http://localhost:3000

### Erreurs d'authentification

Vérifiez que :
1. Le backend est accessible
2. Les endpoints d'API sont corrects
3. Les tokens sont bien stockés dans le localStorage
