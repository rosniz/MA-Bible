"""
Bible serializers for API endpoints.
"""
from rest_framework import serializers
from .models import Book, Chapter, Verse


class VerseSerializer(serializers.ModelSerializer):
    """Serializer for verse details."""
    
    reference = serializers.CharField(read_only=True)
    book_name = serializers.CharField(source='chapter.book.name', read_only=True)
    chapter_number = serializers.IntegerField(source='chapter.number', read_only=True)
    
    class Meta:
        model = Verse
        fields = [
            'id',
            'reference',
            'book_name',
            'chapter_number',
            'number',
            'text',
            'version',
        ]


class ChapterSerializer(serializers.ModelSerializer):
    """Serializer for chapter with verses."""
    
    verses = VerseSerializer(many=True, read_only=True)
    book_name = serializers.CharField(source='book.name', read_only=True)
    
    class Meta:
        model = Chapter
        fields = [
            'id',
            'book_name',
            'number',
            'verse_count',
            'verses',
        ]


class ChapterListSerializer(serializers.ModelSerializer):
    """Serializer for chapter list (without verses)."""
    
    book_name = serializers.CharField(source='book.name', read_only=True)
    
    class Meta:
        model = Chapter
        fields = [
            'id',
            'book_name',
            'number',
            'verse_count',
        ]


class BookSerializer(serializers.ModelSerializer):
    """Serializer for book details."""
    
    chapters = ChapterListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Book
        fields = [
            'id',
            'name',
            'testament',
            'order',
            'abbreviation',
            'chapter_count',
            'chapters',
        ]


class BookListSerializer(serializers.ModelSerializer):
    """Serializer for book list (without chapters)."""
    
    class Meta:
        model = Book
        fields = [
            'id',
            'name',
            'testament',
            'order',
            'abbreviation',
            'chapter_count',
        ]