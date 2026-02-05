import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const {
    googleBookId,
    overall,
    character,
    pacing,
    storyline,
    writing,
    spicy,
  } = await req.json()

  if (!googleBookId || overall == null) {
    return Response.json(
      { message: "Missing googleBookId or overall rating" },
      { status: 400 }
    )
  }

  const { error } = await supabase.rpc("rate_book_by_google_id", {
    p_google_book_id: googleBookId,
    p_overall: overall,
    p_character: character ?? null,
    p_pacing: pacing ?? null,
    p_storyline: storyline ?? null,
    p_writing: writing ?? null,
    p_spicy: spicy ?? null,
  })

  if (error) throw error

  return Response.json({ success: true })
}
