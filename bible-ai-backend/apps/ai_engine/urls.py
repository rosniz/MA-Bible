"""
AI Engine URL configuration.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIEngineViewSet, ConversationViewSet

app_name = 'ai_engine'

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')

urlpatterns = [
    path('ask/', AIEngineViewSet.as_view({'post': 'ask'}), name='ask'),
    path('', include(router.urls)),
]