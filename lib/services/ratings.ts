import type { SupabaseClient } from "@supabase/supabase-js"

export async function rateBook(
  supabase: SupabaseClient,
  googleBookId: string,
  ratings: {
    overall: number
    character?: number
    pacing?: number
    storyline?: number
    writing?: number
    spicy?: number
  }
) {
  const { error } = await supabase.rpc("rate_book_by_google_id", {
    p_google_book_id: googleBookId,
    p_overall: ratings.overall,
    p_character: ratings.character ?? null,
    p_pacing: ratings.pacing ?? null,
    p_storyline: ratings.storyline ?? null,
    p_writing: ratings.writing ?? null,
    p_spicy: ratings.spicy ?? null,
  })

  if (error) throw error
}
