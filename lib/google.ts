const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export interface GoogleSearchResult {
  google_book_id: string;
  title: string;
  authors: string | null;
  cover_url: string | null;
  google_avg_rating: number | null;
  google_rating_count: number | null;
}

/**
 * Image optimization :
 * - force https
 * - try zoom=3
 * - fallback-safe (UI should still handle onError)
 */
function optimizeCover(thumbnail?: string): string | null {
  if (!thumbnail) return null;

  const https = thumbnail.replace("http://", "https://");

  // If Google provided zoom=1, try zoom=3
  if (https.includes("zoom=")) {
    return https.replace("zoom=1", "zoom=3");
  }

  // Otherwise return as-is
  return https;
}

export async function searchGoogleBooks(
  query: string,
  maxResults = 20
): Promise<GoogleSearchResult[]> {
  const res = await fetch(
    `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to search Google Books");

  const json = await res.json();
  if (!json.items) return [];

  return json.items.map(
    (item: { id: string; volumeInfo: Record<string, unknown> }) => {
      const v = item.volumeInfo as {
        title?: string;
        authors?: string[];
        imageLinks?: { thumbnail?: string };
        averageRating?: number;
        ratingsCount?: number;
      };

      return {
        google_book_id: item.id,
        title: v.title ?? "Untitled",
        authors: v.authors?.join(", ") ?? null,
        cover_url: optimizeCover(v.imageLinks?.thumbnail),
        google_avg_rating: v.averageRating ?? null,
        google_rating_count: v.ratingsCount ?? null,
      };
    }
  );
}

export async function fetchGoogleBookById(googleBookId: string) {
  const res = await fetch(
    `${GOOGLE_BOOKS_API}/${googleBookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to fetch Google Book");

  const json = await res.json();
  const v = json.volumeInfo as {
    title?: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
    description?: string;
    publishedDate?: string;
    language?: string;
    averageRating?: number;
    ratingsCount?: number;
    categories?: string[];
  };

  return {
    google_book_id: googleBookId,
    title: v.title ?? "Untitled",
    authors: v.authors?.join(", ") ?? null,
    cover_url: optimizeCover(v.imageLinks?.thumbnail),
    summary: v.description ?? null,
    published_year: v.publishedDate
      ? Number(v.publishedDate.slice(0, 4))
      : null,
    language: v.language ?? null,
    google_avg_rating: v.averageRating ?? null,
    google_rating_count: v.ratingsCount ?? null,
    genres: v.categories ?? [],
  };
}
