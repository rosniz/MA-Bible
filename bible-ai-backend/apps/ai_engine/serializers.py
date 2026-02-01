"""
AI Engine serializers.
"""
from rest_framework import serializers
from .models import Conversation


class QuestionSerializer(serializers.Serializer):
    """Serializer for user questions."""
    
    question = serializers.CharField(
        max_length=500,
        help_text="Question biblique de l'utilisateur"
    )
    
    def validate_question(self, value):
        """Validate question length."""
        if len(value.strip()) < 5:
            raise serializers.ValidationError(
                "La question doit contenir au moins 5 caractères."
            )
        return value.strip()


class VerseResponseSerializer(serializers.Serializer):
    """Serializer for verse in response."""
    
    reference = serializers.CharField()
    text = serializers.CharField()


class AIResponseSerializer(serializers.Serializer):
    """Serializer for AI response."""
    
    question = serializers.CharField()
    verses = VerseResponseSerializer(many=True)
    explanation = serializers.CharField()
    practical_application = serializers.CharField()
    verse_count = serializers.IntegerField()


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for conversation history."""
    
    class Meta:
        model = Conversation
        fields = [
            'id',
            'question',
            'response',
            'ai_provider',
            'processing_time',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']