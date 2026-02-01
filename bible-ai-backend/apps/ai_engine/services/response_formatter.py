"""
Response formatter for AI responses.
"""
from typing import Dict, List


class ResponseFormatter:
    """
    Format and validate AI responses.
    """
    
    @staticmethod
    def validate_response(response: dict) -> bool:
        """
        Validate that AI response has required fields.
        
        Args:
            response: AI response dict
            
        Returns:
            bool: True if valid
        """
        required_fields = ['verses', 'explanation', 'practical_application']
        
        for field in required_fields:
            if field not in response:
                return False
        
        # Validate verses structure
        if not isinstance(response['verses'], list):
            return False
        
        for verse in response['verses']:
            if 'reference' not in verse or 'text' not in verse:
                return False
        
        return True
    
    @staticmethod
    def format_response(response: dict, question: str) -> dict:
        """
        Format AI response for API output.
        
        Args:
            response: Raw AI response
            question: Original question
            
        Returns:
            dict: Formatted response
        """
        return {
            'question': question,
            'verses': response.get('verses', []),
            'explanation': response.get('explanation', ''),
            'practical_application': response.get('practical_application', ''),
            'verse_count': len(response.get('verses', []))
        }
    
    @staticmethod
    def get_fallback_response(question: str, error: str = None) -> dict:
        """
        Get fallback response in case of errors.
        
        Args:
            question: Original question
            error: Error message
            
        Returns:
            dict: Fallback response
        """
        return {
            'question': question,
            'verses': [],
            'explanation': (
                "Je suis désolé, je rencontre actuellement des difficultés pour "
                "répondre à votre question. Veuillez réessayer plus tard."
            ),
            'practical_application': (
                "En attendant, n'hésitez pas à consulter votre Bible directement "
                "ou à demander conseil à votre communauté de foi."
            ),
            'verse_count': 0,
            'error': error
        }