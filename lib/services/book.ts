import type { SupabaseClient } from "@supabase/supabase-js"

// ────────────────────────────────
// Internal (StorySpine ID based)
// ────────────────────────────────

export async function getBookPage(supabase: SupabaseClient, bookId: number) {
  const { data, error } = await supabase.rpc("get_book_page", {
    p_book_id: bookId,
  })
  if (error) throw error
  return data?.[0]
}

export async function getBookReviews(supabase: SupabaseClient, bookId: number, limit = 10, offset = 0) {
  const { data, error } = await supabase.rpc("get_book_reviews", {
    p_book_id: bookId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw error
  return data
}

export async function getBookReadingCount(supabase: SupabaseClient, bookId: number) {
  const { data, error } = await supabase.rpc("get_book_reading_count", {
    p_book_id: bookId,
  })
  if (error) throw error
  return data
}

export async function getUserBookStatus(supabase: SupabaseClient, bookId: number) {
  const { data, error } = await supabase.rpc("get_user_book_status", {
    p_book_id: bookId,
  })
  if (error) throw error
  return data?.[0]
}

// ─────────────────────────────────
// Public (Google Book ID based)
// ─────────────────────────────────

export async function getBookPageByGoogleId(supabase: SupabaseClient, googleBookId: string) {
  const { data, error } = await supabase.rpc("get_book_page_by_google_id", {
    p_google_book_id: googleBookId,
  })
  if (error) throw error
  return data?.[0]
}

export async function getBookReviewsByGoogleId(
  supabase: SupabaseClient,
  googleBookId: string,
  limit = 10,
  offset = 0
) {
  const { data, error } = await supabase.rpc("get_book_reviews_by_google_id", {
    p_google_book_id: googleBookId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw error
  return data
}

export async function getBookReadingCountByGoogleId(supabase: SupabaseClient, googleBookId: string) {
  const { data, error } = await supabase.rpc(
    "get_book_reading_count_by_google_id",
    {
      p_google_book_id: googleBookId,
    }
  )
  if (error) throw error
  return data
}

export async function getUserBookStatusByGoogleId(supabase: SupabaseClient, googleBookId: string) {
  const { data, error } = await supabase.rpc(
    "get_user_book_status_by_google_id",
    {
      p_google_book_id: googleBookId,
    }
  )
  if (error) throw error
  return data?.[0]
}
