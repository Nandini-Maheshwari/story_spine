export interface Book {
  google_book_id: string;
  title: string;
  authors: string | null;
  cover_url: string | null;
  summary: string | null;
  published_year: number | null;
  language: string | null;
  google_avg_rating: number | null;
  google_rating_count: number | null;
  ss_avg_overall: number | null;
  ss_avg_character: number | null;
  ss_avg_pacing: number | null;
  ss_avg_storyline: number | null;
  ss_avg_writing: number | null;
  ss_rating_count: number | null;
  genres: string[];
}

export interface Review {
  id: number;
  content: string;
  spoiler: boolean;
  like_count: number;
  is_liked: boolean;
  created_at: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  deleted_at: string | null;
  is_own_review: boolean;
  is_private: boolean;
  reviewer_is_following?: boolean;
  user_overall: number | null;
  user_character: number | null;
  user_pacing: number | null;
  user_storyline: number | null;
  user_writing: number | null;
  user_spicy: number | null;
}

export interface UserBookStatus {
  status: string;
  progress_percent: number | null;
  note: string | null;
  started_at: string | null;
  finished_at: string | null;
}

export interface LibraryBook {
  id: number;
  google_book_id: string;
  title: string;
  cover_url: string | null;
  status: string;
  progress_percent: number | null;
  note: string | null;
  started_at: string | null;
  finished_at: string | null;
  genres: string[];
}

export interface BookPageResponse {
  source: "google" | "storyspine";
  book: Book;
  reviews: Review[];
  readingCount: number;
  userStatus: UserBookStatus | null;
}
