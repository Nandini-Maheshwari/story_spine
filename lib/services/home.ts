import { supabase } from "@/lib/supabase"

export async function getTrendingBooks() {
  const { data, error } = await supabase.rpc("get_trending_books")
  if (error) throw error
  return data
}

export async function getPersonalizedFeed() {
  const { data, error } = await supabase.rpc("get_personalized_feed")
  if (error) throw error
  return data
}
