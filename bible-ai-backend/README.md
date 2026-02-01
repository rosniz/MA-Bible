# 📖 Bible AI Backend

Backend Django pour application mobile biblique avec intelligence artificielle.

## 🎯 Caractéristiques

- **Authentification** : Inscription/connexion par email
- **API Bible** : Livres, chapitres, versets
- **IA Éthique** : Réponses bibliques avec Anthropic Claude ou OpenAI
- **Historique** : Sauvegarde des conversations
- **Production-ready** : Docker, PostgreSQL, déploiement Render

## 🛠️ Stack Technique

- Python 3.11+
- Django 5.0
- Django REST Framework
- PostgreSQL 16
- Docker & Docker Compose
- Gunicorn + Whitenoise
- Anthropic Claude / OpenAI

## 📁 Structure du Projet

```
bible-ai-backend/
├── config/                 # Configuration Django
│   └── settings/          # Settings séparés (base, dev, prod)
├── apps/
│   ├── users/            # Authentification
│   ├── bible/            # Données bibliques
│   └── ai_engine/        # Moteur IA
├── scripts/              # Scripts utilitaires
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## 🚀 Installation Locale

### Prérequis

- Docker & Docker Compose
- Git

### Étapes

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd bible-ai-backend
```

2. **Créer le fichier .env**
```bash
cp .env.example .env
```

3. **Configurer les variables d'environnement**

Éditer `.env` et ajouter votre clé API :
```env
ANTHROPIC_API_KEY=votre-clé-api-anthropic
# ou
OPENAI_API_KEY=votre-clé-api-openai
```

4. **Lancer avec Docker**
```bash
docker-compose up --build
```

5. **Créer un superutilisateur**
```bash
docker-compose exec web python manage.py createsuperuser
```

6. **Accéder à l'application**
- API : http://localhost:8000/api/v1/
- Admin : http://localhost:8000/admin/

## 📝 Commandes Utiles

### Docker

```bash
# Lancer les services
docker-compose up

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Rebuild après modifications
docker-compose up --build
```

### Django

```bash
# Migrations
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate

# Shell Django
docker-compose exec web python manage.py shell

# Tests
docker-compose exec web python manage.py test
```

## 🔌 Endpoints API

### Authentification

```http
POST /api/v1/users/register/
POST /api/v1/auth/token/
POST /api/v1/auth/token/refresh/
GET /api/v1/users/profile/
PUT /api/v1/users/profile/
POST /api/v1/users/change-password/
```

### Bible

```http
GET /api/v1/bible/books/
GET /api/v1/bible/books/{id}/
GET /api/v1/bible/chapters/
GET /api/v1/bible/chapters/{id}/
GET /api/v1/bible/verses/
GET /api/v1/bible/verses/search/?q=amour
```

### IA

```http
POST /api/v1/ai/ask/
GET /api/v1/ai/conversations/
GET /api/v1/ai/conversations/{id}/
```

### Exemple de requête IA

```bash
curl -X POST http://localhost:8000/api/v1/ai/ask/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "question": "Que dit la Bible sur l'amour?"
  }'
```

**Réponse :**

```json
{
  "question": "Que dit la Bible sur l'amour?",
  "verses": [
    {
      "reference": "1 Corinthiens 13:4-7",
      "text": "L'amour est patient, il est plein de bonté..."
    }
  ],
  "explanation": "La Bible présente l'amour comme...",
  "practical_application": "Dans votre vie quotidienne...",
  "verse_count": 1
}
```

## 🌐 Déploiement sur Render

### 1. Préparer le projet

Le projet est déjà configuré pour Render avec :
- `Dockerfile`
- `render.yaml` (à créer si nécessaire)
- Settings de production

### 2. Créer une base de données PostgreSQL

Sur Render :
1. Créer un nouveau service PostgreSQL
2. Noter l'URL de connexion (Internal Database URL)

### 3. Créer le Web Service

1. Connecter votre repo GitHub/GitLab
2. Choisir "Docker" comme environnement
3. Configurer les variables d'environnement :

```env
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=votre-secret-key-production
DEBUG=False
ALLOWED_HOSTS=votre-app.onrender.com
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=votre-clé-api
AI_PROVIDER=anthropic
CORS_ALLOWED_ORIGINS=https://votre-frontend.com
```

4. Déployer !

### 4. Commandes post-déploiement

```bash
# Migrations
python manage.py migrate

# Créer superuser
python manage.py createsuperuser

# Collecter les fichiers statiques (déjà fait automatiquement)
python manage.py collectstatic --noinput
```

## 🔒 Sécurité

### Variables sensibles

Ne JAMAIS commiter :
- `.env`
- Clés API
- Secrets Django

### Checklist production

- [x] `DEBUG=False`
- [x] `SECRET_KEY` fort et unique
- [x] HTTPS activé (Render le fait automatiquement)
- [x] CORS configuré correctement
- [x] Variables d'environnement sécurisées
- [x] Migrations appliquées

## 🧪 Tests

```bash
# Tous les tests
docker-compose exec web python manage.py test

# Tests d'une app spécifique
docker-compose exec web python manage.py test apps.users

# Coverage
docker-compose exec web coverage run --source='.' manage.py test
docker-compose exec web coverage report
```

## 📊 Monitoring

### Logs en production

```bash
# Sur Render
render logs <service-name>

# En local
docker-compose logs -f web
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📖 Documentation API

Une fois lancé, accédez à :
- Swagger UI : http://localhost:8000/api/docs/ (à configurer si nécessaire)
- Admin Panel : http://localhost:8000/admin/

## 🆘 Dépannage

### Le conteneur ne démarre pas

```bash
# Vérifier les logs
docker-compose logs web

# Reconstruire
docker-compose down
docker-compose up --build
```

### Erreur de connexion à la base

```bash
# Vérifier que PostgreSQL est en cours
docker-compose ps

# Recréer la base
docker-compose down -v
docker-compose up
```

### Erreur API IA

- Vérifier que `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY` est défini
- Vérifier les quotas API
- Consulter les logs : `docker-compose logs -f web`

## 📚 Ressources

- [Documentation Django](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Anthropic API](https://docs.anthropic.com/)
- [Render Docs](https://render.com/docs)

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé avec ❤️ pour servir la Parole de Dieu