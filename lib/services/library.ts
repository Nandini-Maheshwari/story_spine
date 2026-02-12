import type { SupabaseClient } from "@supabase/supabase-js"
import { fetchGoogleBookById } from "@/lib/google"

export async function getUserLibrary(
  supabase: SupabaseClient,
  status?: string,
  year?: number,
  genre?: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await supabase.rpc("get_user_library", {
    p_status: status ?? null,
    p_year: year ?? null,
    p_genre: genre ?? null,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw error
  return data
}

export async function addBookToLibrary(
  supabase: SupabaseClient,
  googleBookId: string,
  status: string
) {
  const book = await fetchGoogleBookById(googleBookId)

  const { data, error } = await supabase.rpc("add_book_to_library", {
    p_google_book_id: book.google_book_id,
    p_title: book.title,
    p_authors: book.authors,
    p_cover_url: book.cover_url,
    p_summary: book.summary,
    p_published_year: book.published_year,
    p_language: book.language,
    p_genres: book.genres,
    p_status: status,
  })

  if (error) throw error
  return data
}

export async function updateLibraryStatus(
  supabase: SupabaseClient,
  googleBookId: string,
  status: string,
  progress?: number
) {
  const { error } = await supabase.rpc(
    "update_reading_status_by_google_id",
    {
      p_google_book_id: googleBookId,
      p_status: status,
      p_progress: progress ?? null,
    }
  )

  if (error) throw error
}
