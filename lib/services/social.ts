import type { SupabaseClient } from "@supabase/supabase-js"

export async function canViewUser(supabase: SupabaseClient, targetUserId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("can_view_user", {
    target_user_id: targetUserId,
  })
  if (error) throw error
  return data as boolean
}

export async function followUser(supabase: SupabaseClient, targetId: string): Promise<void> {
  const { error } = await supabase.rpc("follow_user", { p_target: targetId })
  if (error) throw error
}

export async function unfollowUser(supabase: SupabaseClient, targetId: string): Promise<void> {
  const { error } = await supabase.rpc("unfollow_user", { p_target: targetId })
  if (error) throw error
}

export async function removeFollower(supabase: SupabaseClient, followerId: string): Promise<void> {
  const { error } = await supabase.rpc("remove_follower", { p_follower_id: followerId })
  if (error) throw error
}

export async function toggleProfilePrivacy(supabase: SupabaseClient, isPrivate: boolean): Promise<void> {
  const { error } = await supabase.rpc("toggle_profile_privacy", { p_is_private: isPrivate })
  if (error) throw error
}

export async function getFollowers(
  supabase: SupabaseClient,
  userId: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await supabase.rpc("get_followers", {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw error
  return data
}

export async function getFollowing(
  supabase: SupabaseClient,
  userId: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await supabase.rpc("get_following", {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw error
  return data
}
