#!/bin/bash

set -e

echo "🚀 Starting Bible AI Backend on Render..."

# Appliquer les migrations
echo "🔄 Running migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Créer un superutilisateur si nécessaire
echo "👤 Checking superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@bible-ai.com', 'Admin@123!')
    print('✅ Superuser created: admin / Admin@123!')
else:
    print('ℹ️  Superuser already exists')
" || echo "⚠️  Superuser creation skipped"

echo "✨ Setup complete! Starting Gunicorn..."

# Démarrer Gunicorn
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120