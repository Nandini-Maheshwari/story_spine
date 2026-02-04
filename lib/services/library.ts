import { supabase } from "@/lib/supabase"

export async function getUserLibrary(
  status?: string,
  year?: number,
  genre?: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await supabase.rpc("get_user_library", {
    p_status: status ?? null,
    p_year: year ?? null,
    p_genre: genre ?? null,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw error
  return data
}
