"""
AI Engine admin configuration.
"""
from django.contrib import admin
from .models import Conversation


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    """Admin for Conversation model."""
    
    list_display = [
        'id',
        'user_email',
        'question_preview',
        'ai_provider',
        'processing_time',
        'created_at'
    ]
    list_filter = ['ai_provider', 'created_at']
    search_fields = ['question', 'user__email']
    readonly_fields = ['created_at', 'processing_time']
    ordering = ['-created_at']
    
    def user_email(self, obj):
        """Get user email or Anonymous."""
        return obj.user.email if obj.user else 'Anonyme'
    
    user_email.short_description = 'Utilisateur'
    
    def question_preview(self, obj):
        """Show question preview."""
        return obj.question[:100] + '...' if len(obj.question) > 100 else obj.question
    
    question_preview.short_description = 'Question'