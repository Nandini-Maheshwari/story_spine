import type { Book, Review } from "@/types/book";

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  books_read_count: number;
  deleted_at: string | null;
}

export interface ProfileReview {
  id: number;
  content: string;
  spoiler: boolean;
  like_count: number;
  created_at: string;
  book_title: string;
  google_book_id: string;
}

export interface UserProfileResponse {
  profile: UserProfile;
  genres: string[];
  currentlyReading: Book[];
  recentlyFinished: Book[];
  recentReviews: ProfileReview[];
}
