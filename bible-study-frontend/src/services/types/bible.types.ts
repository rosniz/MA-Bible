export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  chapters_count: number;
}

export interface Chapter {
  id: number;
  book: number;
  chapter_number: number;
  verses_count: number;
}

export interface Verse {
  id: number;
  chapter: number;
  verse_number: number;
  text: string;
  book_name?: string;
  reference?: string;
}

export interface SearchVersesRequest {
  q: string;
}

export interface SearchVersesResponse {
  count: number;
  query: string;
  results: Verse[];
}
