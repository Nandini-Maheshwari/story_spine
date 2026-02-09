import { createSupabaseServerClient } from "@/lib/supabase-server"
import { updateUserGenres } from "@/lib/services/preferences"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { genreIds } = await req.json()
  if (!Array.isArray(genreIds)) {
    return Response.json({ message: "Invalid genres" }, { status: 400 })
  }

  await updateUserGenres(genreIds)
  return Response.json({ success: true })
}
