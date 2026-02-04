import { supabase } from "@/lib/supabase"

export async function getFollowers(userId: string) {
  const { data, error } = await supabase.rpc("get_followers", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}

export async function getFollowing(userId: string) {
  const { data, error } = await supabase.rpc("get_following", {
    p_user_id: userId,
  })
  if (error) throw error
  return data
}
