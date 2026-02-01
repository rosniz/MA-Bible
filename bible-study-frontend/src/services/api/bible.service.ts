import apiClient from './axios.config';
import {
  Book,
  Chapter,
  Verse,
  SearchVersesResponse,
} from '../types/bible.types';

// ─── Helper: récupère toutes les pages d'une endpoint paginée ────────────────
const fetchAllPages = async <T>(url: string): Promise<T[]> => {
  let results: T[] = [];
  let page = 1;
  let hasNext = true;

  // Détecte si l'URL a déjà un ? (paramètres existants)
  const separator = url.includes('?') ? '&' : '?';

  while (hasNext) {
    const response = await apiClient.get<{ results: T[]; next: string | null }>(
      `${url}${separator}page=${page}`
    );
    results = results.concat(response.data.results);
    hasNext = response.data.next !== null;
    page++;
  }

  return results;
};

export const bibleService = {
  // Récupère les 66 livres (paginated → on récupère tout)
  async getBooks(): Promise<Book[]> {
    return fetchAllPages<Book>('/bible/books/');
  },

  // Récupère les chapitres d'un livre donné
  async getChapters(bookId: number): Promise<Chapter[]> {
    return fetchAllPages<Chapter>(`/bible/chapters/?book=${bookId}`);
  },

  // Récupère les versets — filtrable par livre et/ou chapitre
  async getVerses(bookId?: number, chapterId?: number): Promise<Verse[]> {
    let url = '/bible/verses/';
    const params: string[] = [];

    if (bookId) params.push(`book=${bookId}`);
    if (chapterId) params.push(`chapter=${chapterId}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return fetchAllPages<Verse>(url);
  },

  // Recherche de versets par mot-clé
  async searchVerses(query: string): Promise<SearchVersesResponse> {
    const response = await apiClient.get<SearchVersesResponse>(
      `/bible/verses/search/?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Verset aléatoire — récupère la première page puis pioche au hasard
  async getRandomVerse(): Promise<Verse | null> {
    try {
      const response = await apiClient.get<{ results: Verse[] }>('/bible/verses/');
      const verses = response.data.results;
      if (verses.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * verses.length);
      return verses[randomIndex];
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  },
};