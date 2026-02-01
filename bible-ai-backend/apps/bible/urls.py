"""
Bible URL configuration.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ChapterViewSet, VerseViewSet

app_name = 'bible'

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'chapters', ChapterViewSet, basename='chapter')
router.register(r'verses', VerseViewSet, basename='verse')

urlpatterns = [
    path('', include(router.urls)),
]