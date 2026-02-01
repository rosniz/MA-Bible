"""
Bible admin configuration.
"""
from django.contrib import admin
from .models import Book, Chapter, Verse


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    """Admin for Book model."""
    
    list_display = ['name', 'testament', 'order', 'abbreviation', 'chapter_count']
    list_filter = ['testament']
    search_fields = ['name', 'abbreviation']
    ordering = ['order']


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    """Admin for Chapter model."""
    
    list_display = ['__str__', 'book', 'number', 'verse_count']
    list_filter = ['book__testament', 'book']
    search_fields = ['book__name']
    ordering = ['book__order', 'number']


@admin.register(Verse)
class VerseAdmin(admin.ModelAdmin):
    """Admin for Verse model."""
    
    list_display = ['reference', 'text_preview', 'version']
    list_filter = ['version', 'chapter__book__testament']
    search_fields = ['text', 'chapter__book__name']
    ordering = ['chapter__book__order', 'chapter__number', 'number']
    
    def text_preview(self, obj):
        """Show text preview."""
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    
    text_preview.short_description = 'Aperçu'