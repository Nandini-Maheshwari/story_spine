import { createSupabaseServerClient } from "@/lib/supabase-server"
import { upsertReview } from "@/lib/services/review"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  await upsertReview(googleBookId, content, spoiler ?? false)
  return Response.json({ success: true })
}
