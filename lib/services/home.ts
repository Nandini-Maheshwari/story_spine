import type { SupabaseClient } from "@supabase/supabase-js"

export async function getTrendingBooks(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_trending_books")
  if (error) throw error
  return data
}

export async function getPersonalizedFeed(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_personalized_feed")
  if (error) throw error
  return data
}
