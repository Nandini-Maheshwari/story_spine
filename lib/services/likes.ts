import { supabase } from "@/lib/supabase"

export async function likeReview(reviewId: number) {
  const { error } = await supabase.rpc("like_review", {
    p_review_id: reviewId,
  })
  if (error) throw error
}

export async function unlikeReview(reviewId: number) {
  const { error } = await supabase.rpc("unlike_review", {
    p_review_id: reviewId,
  })
  if (error) throw error
}
