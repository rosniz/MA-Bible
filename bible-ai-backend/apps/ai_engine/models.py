"""
AI Engine models for conversation history.
"""
from django.db import models
from django.conf import settings


class Conversation(models.Model):
    """Conversation history with AI."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations',
        verbose_name='utilisateur',
        null=True,
        blank=True
    )
    
    question = models.TextField('question')
    response = models.JSONField('réponse')
    
    # Metadata
    ai_provider = models.CharField('fournisseur IA', max_length=20, default='anthropic')
    processing_time = models.FloatField('temps de traitement (s)', null=True, blank=True)
    
    created_at = models.DateTimeField('date de création', auto_now_add=True)
    
    class Meta:
        verbose_name = 'conversation'
        verbose_name_plural = 'conversations'
        ordering = ['-created_at']
    
    def __str__(self):
        user_info = f"User {self.user.email}" if self.user else "Anonymous"
        return f"{user_info} - {self.question[:50]}..."