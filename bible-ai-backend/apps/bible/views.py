"""
Bible views for API endpoints.
"""
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Book, Chapter, Verse
from .serializers import (
    BookSerializer,
    BookListSerializer,
    ChapterSerializer,
    ChapterListSerializer,
    VerseSerializer
)


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for biblical books."""
    queryset = Book.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'abbreviation']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookSerializer
    
    @extend_schema(tags=['Bible'], summary="Liste des livres bibliques")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @extend_schema(tags=['Bible'], summary="Détails d'un livre")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ChapterViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for chapters."""
    queryset = Chapter.objects.select_related('book').all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChapterListSerializer
        return ChapterSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        book_id = self.request.query_params.get('book', None)
        
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        
        return queryset
    
    @extend_schema(
        tags=['Bible'],
        summary="Liste des chapitres",
        parameters=[
            OpenApiParameter('book', OpenApiTypes.INT, description='Filtrer par livre')
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @extend_schema(tags=['Bible'], summary="Détails d'un chapitre")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class VerseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for verses."""
    queryset = Verse.objects.select_related('chapter__book').all()
    serializer_class = VerseSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['text']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        book_id = self.request.query_params.get('book', None)
        if book_id:
            queryset = queryset.filter(chapter__book_id=book_id)
        
        chapter_id = self.request.query_params.get('chapter', None)
        if chapter_id:
            queryset = queryset.filter(chapter_id=chapter_id)
        
        return queryset
    
    @extend_schema(
        tags=['Bible'],
        summary="Liste des versets",
        parameters=[
            OpenApiParameter('book', OpenApiTypes.INT, description='Filtrer par livre'),
            OpenApiParameter('chapter', OpenApiTypes.INT, description='Filtrer par chapitre')
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @extend_schema(tags=['Bible'], summary="Détails d'un verset")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        tags=['Bible'],
        summary="Rechercher des versets",
        parameters=[
            OpenApiParameter('q', OpenApiTypes.STR, required=True, description='Texte à rechercher (min 3 caractères)')
        ]
    )
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search verses by text content."""
        query = request.query_params.get('q', '')
        
        if not query or len(query) < 3:
            return Response({
                'error': 'La recherche doit contenir au moins 3 caractères.'
            }, status=400)
        
        verses = self.queryset.filter(text__icontains=query)[:50]
        serializer = self.get_serializer(verses, many=True)
        
        return Response({
            'count': len(serializer.data),
            'query': query,
            'results': serializer.data
        })