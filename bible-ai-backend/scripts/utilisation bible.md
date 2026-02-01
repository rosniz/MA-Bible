# 1. Reconstruire et démarrer
docker-compose down -v
docker-compose up --build

# 2. Dans un autre terminal, télécharger la Bible (si pas encore fait)
docker-compose exec web python manage.py download_bible

# 3. La Bible se charge automatiquement au prochain redémarrage
docker-compose restart web

# OU charger manuellement
docker-compose exec web python manage.py load_bible