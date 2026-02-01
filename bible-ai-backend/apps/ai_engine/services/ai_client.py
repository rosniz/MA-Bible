"""
AI Client for interacting with external AI APIs (Gemini/Anthropic/OpenAI).
"""
import logging
import json
from django.conf import settings
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


class AIClient:
    """
    Client for AI API interactions with ethical guidelines.
    Supports: Google Gemini, Anthropic Claude, OpenAI GPT
    """
    
    # System prompt éthique pour guider l'IA
    SYSTEM_PROMPT = """Tu es un assistant biblique bienveillant et respectueux.

RÈGLES ÉTHIQUES STRICTES :
1. Ne JAMAIS te présenter comme Dieu ou parler à Sa place
2. TOUJOURS faire référence à la Bible comme source d'autorité
3. Adopter un ton bienveillant, jamais moralisateur ou condescendant
4. Respecter la liberté de conscience de l'utilisateur
5. Éviter les jugements personnels

STRUCTURE DE RÉPONSE :
1. Comprendre la question avec empathie
2. Identifier 2-5 versets bibliques pertinents
3. Donner une explication simple et accessible
4. Proposer une application pratique concrète

FORMAT DE RÉPONSE (JSON strict) :
{
    "verses": [
        {
            "reference": "Jean 3:16",
            "text": "texte du verset"
        }
    ],
    "explanation": "explication simple et claire",
    "practical_application": "application pratique pour la vie quotidienne"
}

Réponds UNIQUEMENT en JSON, sans texte avant ou après."""
    
    def __init__(self):
        """Initialize AI client based on provider."""
        self.provider = settings.AI_PROVIDER
        
        if self.provider == 'gemini':
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY is not configured")
            
            # Initialiser le client Gemini avec la nouvelle API
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            self.model_name = settings.AI_MODEL_GEMINI
        
        else:
            raise ValueError(f"Unknown AI provider: {self.provider}")
    
    def get_biblical_response(self, question: str) -> dict:
        """
        Get AI response for a biblical question.
        
        Args:
            question: User's question
            
        Returns:
            dict: Structured response with verses, explanation, and application
        """
        try:
            if self.provider == 'gemini':
                return self._get_gemini_response(question)
        
        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            raise
    
    def _get_gemini_response(self, question: str) -> dict:
        """Get response from Google Gemini API."""
        try:
            # Construire le prompt complet
            full_prompt = f"{self.SYSTEM_PROMPT}\n\nQuestion de l'utilisateur: {question}"
            
            # Appeler Gemini avec la nouvelle API
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    top_p=0.95,
                    max_output_tokens=2048,
                    response_mime_type="application/json"  # Force la réponse en JSON
                )
            )
            
            # Extract JSON response
            response_text = response.text.strip()
            
            # Nettoyer le texte (enlever les markdown blocks si présents)
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            # Parse JSON
            response_data = json.loads(response_text)
            
            return response_data
        
        except json.JSONDecodeError as e:
            logger.error(f"Gemini JSON parse error: {str(e)}")
            logger.error(f"Response text: {response_text}")
            raise ValueError(f"Invalid JSON response from Gemini: {str(e)}")
        
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise