# 🚀 Guide de démarrage rapide

## Installation en 3 étapes

### Étape 1 : Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

### Étape 2 : Vérifier le backend

Assurez-vous que votre backend Django est en cours d'exécution sur `http://localhost:8000`

Vous pouvez tester en ouvrant : http://localhost:8000/api/v1/

### Étape 3 : Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

## Premier compte utilisateur

1. Cliquez sur "Inscription" dans la barre de navigation
2. Remplissez le formulaire :
   - Prénom : Votre prénom
   - Email : votre@email.com
   - Mot de passe : Minimum 8 caractères, 1 majuscule, 1 chiffre
3. Cliquez sur "Créer mon compte"
4. Vous serez automatiquement connecté et redirigé vers la page d'accueil

## Fonctionnalités principales

### 🏠 Page d'accueil
- Verset du jour aléatoire
- 8 thèmes spirituels (Foi, Prière, Épreuves, etc.)
- Barre de recherche pour poser une question

### ❓ Poser une question
1. Cliquez sur "Poser une question" ou la barre de recherche
2. Tapez votre question spirituelle (minimum 10 caractères)
3. Optionnel : Sélectionnez un thème
4. Cliquez sur "Obtenir une réponse"
5. L'IA vous fournira une réponse structurée avec :
   - Résumé
   - Versets bibliques pertinents
   - Explication détaillée
   - Application pratique
   - Prière suggérée

### ❤️ Favoris
- Sauvegardez vos versets préférés
- Sauvegardez vos questions et réponses
- Recherchez dans vos favoris
- Filtrez par type (versets / questions / tout)

### 👤 Profil
- Consultez vos statistiques
- Définissez votre objectif spirituel
- Activez/désactivez le mode sombre
- Gérez votre compte

## Mode sombre

Pour activer le mode sombre :
1. Allez dans "Profil"
2. Activez le toggle "Mode sombre"
3. Votre préférence est sauvegardée automatiquement

## Raccourcis clavier

- `Ctrl + K` (ou `Cmd + K` sur Mac) : Recherche rapide (à implémenter)

## Astuces

1. **Questions détaillées** : Plus votre question est précise, plus la réponse sera pertinente
2. **Thèmes** : Utilisez les thèmes pour des questions ciblées
3. **Favoris** : Sauvegardez vos découvertes pour y revenir plus tard
4. **Objectif spirituel** : Définissez un objectif pour rester motivé

## Support technique

### L'application ne se connecte pas au backend ?

Vérifiez que :
1. Le backend Django est lancé sur http://localhost:8000
2. Le fichier `.env` contient la bonne URL : `VITE_API_BASE_URL=http://localhost:8000/api/v1`
3. Les CORS sont configurés dans Django pour accepter http://localhost:3000

### Erreur "Cannot find module" ?

Réinstallez les dépendances :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Le port 3000 est déjà utilisé ?

Modifiez le port dans `vite.config.ts` ou tuez le processus utilisant le port 3000

## Build de production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`

Pour tester le build de production :

```bash
npm run preview
```

## Technologies utilisées

- ⚛️ React 18 + TypeScript
- ⚡ Vite (Build tool ultra-rapide)
- 🎨 TailwindCSS (Styling moderne)
- 🔀 React Router v6 (Navigation)
- 🌐 Axios (Requêtes HTTP)
- 🐻 Zustand (State management léger)
- 🔄 React Query (Cache intelligent)
- ✅ React Hook Form + Zod (Formulaires validés)
- 🎬 Framer Motion (Animations fluides)
- 🎯 Lucide React (Icônes modernes)

## Prochaines étapes

1. Explorez l'interface et toutes les fonctionnalités
2. Posez votre première question spirituelle
3. Sauvegardez vos versets préférés
4. Personnalisez votre profil
5. Définissez votre objectif spirituel

---

**Besoin d'aide ?** Consultez le fichier `README.md` pour plus de détails ou le fichier `COMMANDS.md` pour toutes les commandes disponibles.

Bon voyage spirituel ! 🙏✨
