# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### 1. Prérequis
- Docker Desktop installé
- Git installé
- Un terminal

### 2. Configuration

```bash
# Cloner le projet
git clone <votre-repo>
cd bible-ai-backend

# Créer le fichier .env
cp .env.example .env

# Éditer .env et ajouter votre clé API
# nano .env  (Linux/Mac)
# notepad .env  (Windows)
```

**Dans le .env, ajouter au minimum :**
```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 3. Lancer l'application

```bash
# Lancer tous les services
docker-compose up --build

# Dans un autre terminal, créer un admin
docker-compose exec web python manage.py createsuperuser
```

### 4. Tester l'API

#### S'inscrire
```bash
curl -X POST http://localhost:8000/api/v1/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

#### Obtenir un token
```bash
curl -X POST http://localhost:8000/api/v1/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Vous recevrez :
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Poser une question à l'IA
```bash
curl -X POST http://localhost:8000/api/v1/ai/ask/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -d '{
    "question": "Que dit la Bible sur la foi?"
  }'
```

## Commandes Quotidiennes

```bash
# Démarrer
docker-compose up

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f web

# Migrations
docker-compose exec web python manage.py migrate

# Shell Django
docker-compose exec web python manage.py shell

# Tests
docker-compose exec web python manage.py test
```

## URLs Importantes

- API : http://localhost:8000/api/v1/
- Admin : http://localhost:8000/admin/
- Docs API : http://localhost:8000/api/v1/ (naviguer avec le browser)

## Prochaines Étapes

1. ✅ Charger les données bibliques complètes
2. ✅ Tester tous les endpoints
3. ✅ Configurer le frontend mobile
4. ✅ Déployer sur Render

## Besoin d'aide ?

Consultez le README.md complet pour plus de détails !