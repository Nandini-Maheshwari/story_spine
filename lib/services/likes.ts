import type { SupabaseClient } from "@supabase/supabase-js"

export async function likeReview(supabase: SupabaseClient, reviewId: number) {
  const { error } = await supabase.rpc("like_review", {
    p_review_id: reviewId,
  })
  if (error) throw error
}

export async function unlikeReview(supabase: SupabaseClient, reviewId: number) {
  const { error } = await supabase.rpc("unlike_review", {
    p_review_id: reviewId,
  })
  if (error) throw error
}
