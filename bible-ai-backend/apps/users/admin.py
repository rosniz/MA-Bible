"""
User admin configuration.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model."""
    
    list_display = [
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'date_joined'
    ]
    
    list_filter = [
        'is_active',
        'is_staff',
        'date_joined'
    ]
    
    search_fields = [
        'email',
        'first_name',
        'last_name'
    ]
    
    ordering = ['-date_joined']
    
    readonly_fields = ['date_joined', 'last_login']
    
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'phone_number')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Dates importantes', {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'password1', 'password2'),
        }),
    )