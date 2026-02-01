"""
Charge les données bibliques depuis le fichier JSON.
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.bible.models import Book, Chapter, Verse
import json
import os


class Command(BaseCommand):
    help = 'Charge la Bible depuis le fichier fr_apee.json'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force le rechargement (supprime les données existantes)',
        )
        parser.add_argument(
            '--file',
            type=str,
            default='apps/bible/data/fr_apee.json',
            help='Chemin vers le fichier JSON de la Bible',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('📖 Chargement de la Bible...'))
        
        # Vérifier si les données existent déjà
        if Book.objects.exists():
            if not options['force']:
                self.stdout.write(
                    self.style.WARNING(
                        '⚠️  Des données bibliques existent déjà.\n'
                        'Utilisez --force pour forcer le rechargement.'
                    )
                )
                return
            
            self.stdout.write(self.style.WARNING('🗑️  Suppression des anciennes données...'))
            Verse.objects.all().delete()
            Chapter.objects.all().delete()
            Book.objects.all().delete()
        
        # Charger le fichier JSON
        fixture_path = options['file']
        
        if not os.path.exists(fixture_path):
            self.stdout.write(
                self.style.ERROR(
                    f'❌ Fichier non trouvé: {fixture_path}\n'
                    f'Vérifiez que le fichier existe bien.'
                )
            )
            return
        
        try:
            self.stdout.write(f'📂 Lecture du fichier: {fixture_path}')
            
            # Utiliser utf-8-sig pour gérer le BOM automatiquement
            with open(fixture_path, 'r', encoding='utf-8-sig') as f:
                raw_data = json.load(f)
            
            self.stdout.write('🔄 Transformation des données...')
            
            # Afficher la structure pour debug
            if raw_data:
                self.stdout.write(f'📊 Type de données: {type(raw_data)}')
                if isinstance(raw_data, list) and len(raw_data) > 0:
                    self.stdout.write(f'📊 Premier livre: {list(raw_data[0].keys()) if isinstance(raw_data[0], dict) else "Liste"}')
            
            # Transformer les données au format attendu
            bible_data = self._transform_apee_format(raw_data)
            
            books_created = 0
            chapters_created = 0
            verses_created = 0
            
            # Utiliser une transaction pour la performance
            self.stdout.write('💾 Insertion dans la base de données...')
            
            with transaction.atomic():
                for book_data in bible_data['books']:
                    # Créer le livre
                    book = Book.objects.create(
                        name=book_data['name'],
                        testament=book_data['testament'],
                        order=book_data['order'],
                        abbreviation=book_data['abbreviation'],
                        chapter_count=book_data['chapter_count']
                    )
                    books_created += 1
                    
                    self.stdout.write(f'  📖 {book.order}. {book.name} ({book.chapter_count} chapitres)')
                    
                    # Créer les chapitres en bulk
                    chapters_to_create = []
                    for chapter_data in book_data['chapters']:
                        chapter = Chapter(
                            book=book,
                            number=chapter_data['number'],
                            verse_count=chapter_data['verse_count']
                        )
                        chapters_to_create.append(chapter)
                    
                    chapters = Chapter.objects.bulk_create(chapters_to_create)
                    chapters_created += len(chapters)
                    
                    # Créer les versets en bulk par chapitre
                    for chapter, chapter_data in zip(chapters, book_data['chapters']):
                        verses_to_create = [
                            Verse(
                                chapter=chapter,
                                number=verse_data['number'],
                                text=verse_data['text'],
                                version='APEE'  # Version APEE
                            )
                            for verse_data in chapter_data['verses']
                        ]
                        
                        Verse.objects.bulk_create(verses_to_create, batch_size=1000)
                        verses_created += len(verses_to_create)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n✅ Bible chargée avec succès !\n'
                    f'   📖 {books_created} livres\n'
                    f'   📑 {chapters_created} chapitres\n'
                    f'   ✍️  {verses_created} versets\n'
                    f'   📚 Version: APEE (Assemblées Protestantes Évangéliques)'
                )
            )
        
        except json.JSONDecodeError as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur JSON: {str(e)}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur: {str(e)}')
            )
            import traceback
            traceback.print_exc()
    
    def _transform_apee_format(self, raw_data):
        """
        Transforme le format APEE au format attendu par nos modèles.
        Gère plusieurs formats possibles.
        """
        bible_data = {'books': []}
        
        # Si c'est une liste de livres
        if isinstance(raw_data, list):
            for order, book_entry in enumerate(raw_data, 1):
                bible_data['books'].append(
                    self._parse_book_entry(book_entry, order)
                )
        
        # Si c'est un dictionnaire
        elif isinstance(raw_data, dict):
            # Chercher la clé principale
            if 'books' in raw_data:
                raw_data = raw_data['books']
            elif 'livres' in raw_data:
                raw_data = raw_data['livres']
            
            if isinstance(raw_data, list):
                for order, book_entry in enumerate(raw_data, 1):
                    bible_data['books'].append(
                        self._parse_book_entry(book_entry, order)
                    )
        
        return bible_data
    
    def _parse_book_entry(self, book_entry, order):
        """Parse une entrée de livre - gère différents formats."""
        
        # Normaliser le testament
        testament_mapping = {
            'AT': 'OT',
            'OT': 'OT',
            'NT': 'NT',
            'Ancien Testament': 'OT',
            'Nouveau Testament': 'NT',
        }
        
        # Récupérer le nom du livre
        book_name = book_entry.get('name', 
                    book_entry.get('book', 
                    book_entry.get('livre', f'Livre {order}')))
        
        # Récupérer le testament
        testament_raw = book_entry.get('testament', 'AT' if order <= 39 else 'NT')
        testament = testament_mapping.get(testament_raw, 'OT' if order <= 39 else 'NT')
        
        # Récupérer l'abréviation
        abbreviation = book_entry.get('abbrev', 
                      book_entry.get('abbr', 
                      book_entry.get('abr', book_name[:3].upper())))
        
        # Parser les chapitres - GÈre plusieurs formats
        chapters = []
        
        # Format 1: liste directe de chapitres
        if 'chapters' in book_entry:
            chapters_raw = book_entry['chapters']
        elif 'chapitres' in book_entry:
            chapters_raw = book_entry['chapitres']
        else:
            chapters_raw = []
        
        # Si chapters_raw est une liste de listes (format: [[v1, v2, ...], [v1, v2, ...]])
        if isinstance(chapters_raw, list) and len(chapters_raw) > 0:
            for chapter_idx, chapter_data in enumerate(chapters_raw, 1):
                
                # Format A: Liste de versets directement
                if isinstance(chapter_data, list):
                    verses = []
                    for verse_idx, verse_text in enumerate(chapter_data, 1):
                        if isinstance(verse_text, str):
                            verses.append({
                                'number': verse_idx,
                                'text': verse_text.strip()
                            })
                        elif isinstance(verse_text, dict):
                            verses.append({
                                'number': verse_text.get('verse', verse_text.get('verset', verse_idx)),
                                'text': verse_text.get('text', verse_text.get('texte', '')).strip()
                            })
                    
                    chapters.append({
                        'number': chapter_idx,
                        'verse_count': len(verses),
                        'verses': verses
                    })
                
                # Format B: Dictionnaire avec chapter et verses
                elif isinstance(chapter_data, dict):
                    chapter_num = chapter_data.get('chapter', chapter_data.get('chapitre', chapter_idx))
                    verses_list = chapter_data.get('verses', chapter_data.get('versets', []))
                    
                    verses = []
                    for verse_idx, verse in enumerate(verses_list, 1):
                        if isinstance(verse, str):
                            verses.append({
                                'number': verse_idx,
                                'text': verse.strip()
                            })
                        elif isinstance(verse, dict):
                            verses.append({
                                'number': verse.get('verse', verse.get('verset', verse_idx)),
                                'text': verse.get('text', verse.get('texte', '')).strip()
                            })
                    
                    chapters.append({
                        'number': chapter_num,
                        'verse_count': len(verses),
                        'verses': verses
                    })
        
        return {
            'name': book_name,
            'testament': testament,
            'order': order,
            'abbreviation': abbreviation,
            'chapter_count': len(chapters),
            'chapters': chapters
        }