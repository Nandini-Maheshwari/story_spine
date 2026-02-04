const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

export async function fetchGoogleBookById(googleBookId: string) {
  const res = await fetch(`${GOOGLE_BOOKS_API}/${googleBookId}`)
  if (!res.ok) throw new Error("Failed to fetch Google Book")

  const json = await res.json()

  const v = json.volumeInfo

  return {
    google_book_id: googleBookId,
    title: v.title,
    authors: v.authors?.join(", ") ?? null,
    cover_url: v.imageLinks?.thumbnail ?? null,
    summary: v.description ?? null,
    published_year: v.publishedDate
      ? Number(v.publishedDate.slice(0, 4))
      : null,
    language: v.language,
    google_avg_rating: v.averageRating ?? null,
    google_rating_count: v.ratingsCount ?? null,
    genres: v.categories ?? [],
  }
}
