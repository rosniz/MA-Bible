"""
AI Engine views.
"""
import time
import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from drf_spectacular.utils import extend_schema
from .models import Conversation
from .serializers import (
    QuestionSerializer,
    AIResponseSerializer,
    ConversationSerializer
)
from .services import AIClient, ResponseFormatter

logger = logging.getLogger(__name__)


class AIEngineViewSet(viewsets.ViewSet):
    """ViewSet for AI interactions."""
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @extend_schema(
        tags=['AI'],
        summary="Poser une question biblique",
        request=QuestionSerializer,
        responses={200: AIResponseSerializer}
    )
    @action(detail=False, methods=['post'])
    def ask(self, request):
        """Ask a biblical question to the AI."""
        question_serializer = QuestionSerializer(data=request.data)
        if not question_serializer.is_valid():
            return Response(
                question_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        question = question_serializer.validated_data['question']
        start_time = time.time()
        
        try:
            ai_client = AIClient()
            ai_response = ai_client.get_biblical_response(question)
            
            if not ResponseFormatter.validate_response(ai_response):
                raise ValueError("Invalid AI response format")
            
            formatted_response = ResponseFormatter.format_response(
                ai_response,
                question
            )
            
            processing_time = time.time() - start_time
            
            user = request.user if request.user.is_authenticated else None
            Conversation.objects.create(
                user=user,
                question=question,
                response=formatted_response,
                ai_provider=ai_client.provider,
                processing_time=processing_time
            )
            
            response_serializer = AIResponseSerializer(formatted_response)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error processing AI request: {str(e)}")
            
            fallback = ResponseFormatter.get_fallback_response(
                question,
                error=str(e)
            )
            
            return Response(
                fallback,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for conversation history."""
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Conversation.objects.filter(user=self.request.user)
        return Conversation.objects.none()
    
    @extend_schema(tags=['AI'], summary="Historique des conversations")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @extend_schema(tags=['AI'], summary="Détails d'une conversation")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)