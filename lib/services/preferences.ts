import type { SupabaseClient } from "@supabase/supabase-js"

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
