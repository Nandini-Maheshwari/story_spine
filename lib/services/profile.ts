import { supabase } from "@/lib/supabase"

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.rpc("get_user_profile", {
    p_user_id: userId,
  })
  if (error) throw error
  return data?.[0]
}

export async function getUserGenres(userId: string) {
  const { data, error } = await supabase.rpc("get_user_genres", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}

export async function getUserCurrentlyReading(userId: string) {
  const { data, error } = await supabase.rpc("get_user_currently_reading", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}

export async function getUserRecentlyFinished(userId: string) {
  const { data, error } = await supabase.rpc("get_user_recently_finished", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}

export async function getUserRecentReviews(userId: string) {
  const { data, error } = await supabase.rpc("get_user_recent_reviews", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}
