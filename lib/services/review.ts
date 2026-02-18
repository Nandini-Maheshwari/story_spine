import type { SupabaseClient } from "@supabase/supabase-js"

export async function upsertReview(
  supabase: SupabaseClient,
  googleBookId: string,
  content: string,
  spoiler: boolean
) {
  const { error } = await supabase.rpc("upsert_review_by_google_id", {
    p_google_book_id: googleBookId,
    p_content: content,
    p_spoiler: spoiler,
  })

  if (error) throw error
}
