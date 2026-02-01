"""
Bible models for books, chapters, and verses.
"""
from django.db import models


class Book(models.Model):
    """Biblical book model."""
    
    TESTAMENT_CHOICES = [
        ('OT', 'Ancien Testament'),
        ('NT', 'Nouveau Testament'),
    ]
    
    name = models.CharField('nom', max_length=100)
    testament = models.CharField('testament', max_length=2, choices=TESTAMENT_CHOICES)
    order = models.IntegerField('ordre', unique=True)
    abbreviation = models.CharField('abréviation', max_length=10)
    chapter_count = models.IntegerField('nombre de chapitres')
    
    class Meta:
        verbose_name = 'livre'
        verbose_name_plural = 'livres'
        ordering = ['order']
    
    def __str__(self):
        return self.name


class Chapter(models.Model):
    """Chapter model."""
    
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='chapters',
        verbose_name='livre'
    )
    number = models.IntegerField('numéro')
    verse_count = models.IntegerField('nombre de versets')
    
    class Meta:
        verbose_name = 'chapitre'
        verbose_name_plural = 'chapitres'
        ordering = ['book__order', 'number']
        unique_together = ['book', 'number']
    
    def __str__(self):
        return f"{self.book.name} {self.number}"


class Verse(models.Model):
    """Verse model."""
    
    chapter = models.ForeignKey(
        Chapter,
        on_delete=models.CASCADE,
        related_name='verses',
        verbose_name='chapitre'
    )
    number = models.IntegerField('numéro')
    text = models.TextField('texte')
    
    # Version de la Bible (LSG par défaut)
    version = models.CharField('version', max_length=10, default='LSG')
    
    class Meta:
        verbose_name = 'verset'
        verbose_name_plural = 'versets'
        ordering = ['chapter__book__order', 'chapter__number', 'number']
        unique_together = ['chapter', 'number', 'version']
    
    def __str__(self):
        return f"{self.chapter.book.name} {self.chapter.number}:{self.number}"
    
    @property
    def reference(self):
        """Return full verse reference."""
        return f"{self.chapter.book.name} {self.chapter.number}:{self.number}"