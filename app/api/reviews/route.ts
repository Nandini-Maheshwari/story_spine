import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { googleBookId, content, spoiler } = await req.json()

  if (!googleBookId || !content) {
    return Response.json(
      { message: "Missing googleBookId or content" },
      { status: 400 }
    )
  }

  const { error } = await supabase.rpc("upsert_review_by_google_id", {
    p_google_book_id: googleBookId,
    p_content: content,
    p_spoiler: spoiler ?? false,
  })

  if (error) throw error

  return Response.json({ success: true })
}
