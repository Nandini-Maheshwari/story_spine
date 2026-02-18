import type { SupabaseClient } from "@supabase/supabase-js"

export async function getAllGenres(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_all_genres")
  if (error) throw error
  return data as { id: number; name: string }[]
}

export async function updateUserGenres(supabase: SupabaseClient, genreIds: number[]) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await supabase.from("user_genres").delete().eq("user_id", user.id)

  if (genreIds.length > 0) {
    const rows = genreIds.map(id => ({
      user_id: user.id,
      genre_id: id,
    }))

    const { error } = await supabase.from("user_genres").insert(rows)
    if (error) throw error
  }
}
