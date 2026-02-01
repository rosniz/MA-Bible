#!/bin/bash

set -e

echo "🚀 Starting Bible AI Backend..."

# Attendre que la base de données soit prête
echo "⏳ Waiting for database..."
while ! pg_isready -h db -U bible_user > /dev/null 2>&1; do
  sleep 1
done
echo "✅ Database is ready!"

# Créer les migrations dans le bon ordre
echo "📝 Creating migrations..."
python manage.py makemigrations users --noinput 2>/dev/null || echo "⚠️  Users migrations already exist or failed"
python manage.py makemigrations bible --noinput 2>/dev/null || echo "⚠️  Bible migrations already exist or failed"
python manage.py makemigrations ai_engine --noinput 2>/dev/null || echo "⚠️  AI Engine migrations already exist or failed"
python manage.py makemigrations --noinput 2>/dev/null || echo "⚠️  All migrations already exist or failed"

# Appliquer les migrations dans le bon ordre
echo "🔄 Running migrations..."
python manage.py migrate contenttypes --noinput
python manage.py migrate auth --noinput
python manage.py migrate users --noinput
python manage.py migrate bible --noinput
python manage.py migrate ai_engine --noinput
python manage.py migrate --noinput

# Charger les données bibliques si elles n'existent pas
echo "📚 Checking Bible data..."
python manage.py shell -c "
from apps.bible.models import Book
import os
if not Book.objects.exists():
    print('📥 Bible data not found. Loading from apee_fr.json...')
    if os.path.exists('apps/bible/data/apee_fr.json'):
        import subprocess
        result = subprocess.run(
            ['python', 'manage.py', 'load_bible', '--file', 'apps/bible/data/apee_fr.json'],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(result.stdout)
        else:
            print('⚠️  Bible data loading failed.')
            print(result.stderr)
    else:
        print('⚠️  Fichier apee_fr.json non trouvé dans apps/bible/data/')
        print('   Placez votre fichier Bible dans apps/bible/data/apee_fr.json')
else:
    book_count = Book.objects.count()
    print(f'✅ Bible data already loaded ({book_count} books)')
" 2>/dev/null || echo "⚠️  Bible check skipped"

# Créer un superutilisateur par défaut
echo "👤 Checking superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@bible-ai.com', 'admin123')
    print('✅ Superuser created: admin / admin123')
else:
    print('ℹ️  Superuser already exists')
" 2>/dev/null || echo "⚠️  Superuser creation skipped"

# Collecter les fichiers statiques en production
if [ "$DJANGO_SETTINGS_MODULE" = "config.settings.production" ]; then
  echo "📦 Collecting static files..."
  python manage.py collectstatic --noinput
fi

echo "✨ Setup complete!"

# DÉMARRER LE SERVEUR DJANGO
echo "🌟 Starting Django development server on 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000