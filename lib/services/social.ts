import type { SupabaseClient } from "@supabase/supabase-js"

export async function getFollowers(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.rpc("get_followers", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}

export async function getFollowing(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.rpc("get_following", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}
