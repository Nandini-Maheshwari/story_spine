import { createSupabaseServerClient } from "@/lib/supabase-server"
import { rateBook } from "@/lib/services/ratings"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { googleBookId, overall } = body

  if (!googleBookId || overall == null) {
    return Response.json(
      { message: "Missing googleBookId or overall rating" },
      { status: 400 }
    )
  }

  await rateBook(supabase, googleBookId, body)
  return Response.json({ success: true })
}
