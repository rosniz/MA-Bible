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

    # Mapping des abréviations vers les noms complets en français
    BOOK_NAMES = {
        'gn': 'Genèse', 'ex': 'Exode', 'lv': 'Lévitique', 'nb': 'Nombres', 'dt': 'Deutéronome',
        'jos': 'Josué', 'jg': 'Juges', 'rt': 'Ruth', '1s': '1 Samuel', '2s': '2 Samuel',
        '1r': '1 Rois', '2r': '2 Rois', '1ch': '1 Chroniques', '2ch': '2 Chroniques',
        'esd': 'Esdras', 'ne': 'Néhémie', 'est': 'Esther', 'job': 'Job', 'ps': 'Psaumes',
        'pr': 'Proverbes', 'ec': 'Ecclésiaste', 'ct': 'Cantique', 'es': 'Ésaïe',
        'jr': 'Jérémie', 'lm': 'Lamentations', 'ez': 'Ézéchiel', 'dn': 'Daniel',
        'os': 'Osée', 'jl': 'Joël', 'am': 'Amos', 'ab': 'Abdias', 'jon': 'Jonas',
        'mi': 'Michée', 'na': 'Nahum', 'hab': 'Habacuc', 'soph': 'Sophonie',
        'ag': 'Aggée', 'za': 'Zacharie', 'ml': 'Malachie',
        'mt': 'Matthieu', 'mc': 'Marc', 'lc': 'Luc', 'jn': 'Jean', 'ac': 'Actes',
        'rm': 'Romains', '1co': '1 Corinthiens', '2co': '2 Corinthiens', 'ga': 'Galates',
        'ep': 'Éphésiens', 'ph': 'Philippiens', 'col': 'Colossiens',
        '1th': '1 Thessaloniciens', '2th': '2 Thessaloniciens', '1tm': '1 Timothée',
        '2tm': '2 Timothée', 'tt': 'Tite', 'phm': 'Philémon', 'heb': 'Hébreux',
        'jc': 'Jacques', '1p': '1 Pierre', '2p': '2 Pierre', '1jn': '1 Jean',
        '2jn': '2 Jean', '3jn': '3 Jean', 'jud': 'Jude', 'ap': 'Apocalypse'
    }

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
            
            self.stdout.write(f'🔄 Transformation de {len(raw_data)} livres...')
            
            books_created = 0
            chapters_created = 0
            verses_created = 0
            
            # Utiliser une transaction pour la performance
            with transaction.atomic():
                for order, book_entry in enumerate(raw_data, 1):
                    # Récupérer les informations du livre
                    abbrev = book_entry.get('abbrev', '').lower()
                    book_name = self.BOOK_NAMES.get(abbrev, abbrev.upper())
                    
                    # Déterminer le testament (39 premiers = AT, reste = NT)
                    testament = 'OT' if order <= 39 else 'NT'
                    
                    # Récupérer les chapitres
                    chapters_data = book_entry.get('chapters', [])
                    
                    # Créer le livre
                    book = Book.objects.create(
                        name=book_name,
                        testament=testament,
                        order=order,
                        abbreviation=abbrev.upper(),
                        chapter_count=len(chapters_data)
                    )
                    books_created += 1
                    
                    self.stdout.write(f'  📖 {order}. {book.name} ({len(chapters_data)} chapitres)')
                    
                    # Créer les chapitres et versets
                    for chapter_num, verses_list in enumerate(chapters_data, 1):
                        # Créer le chapitre
                        chapter = Chapter.objects.create(
                            book=book,
                            number=chapter_num,
                            verse_count=len(verses_list)
                        )
                        chapters_created += 1
                        
                        # Créer les versets en bulk
                        verses_to_create = [
                            Verse(
                                chapter=chapter,
                                number=verse_num,
                                text=verse_text.strip(),
                                version='APEE'
                            )
                            for verse_num, verse_text in enumerate(verses_list, 1)
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