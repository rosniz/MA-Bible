"""
Corrige l'encodage du fichier JSON (supprime le BOM).
"""
from django.core.management.base import BaseCommand
import os


class Command(BaseCommand):
    help = 'Corrige l\'encodage du fichier fr_apee.json'

    def handle(self, *args, **options):
        file_path = 'apps/bible/data/fr_apee.json'
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'❌ Fichier non trouvé: {file_path}'))
            return
        
        try:
            # Lire avec utf-8-sig (gère le BOM)
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                content = f.read()
            
            # Réécrire avec utf-8 (sans BOM)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Encodage corrigé: {file_path}\n'
                    f'   Le fichier est maintenant en UTF-8 sans BOM'
                )
            )
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Erreur: {str(e)}'))