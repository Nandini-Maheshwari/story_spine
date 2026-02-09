import { createSupabaseServerClient } from "@/lib/supabase-server"
import { likeReview, unlikeReview } from "@/lib/services/likes"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const { targetId } = await req.json()
  if (!targetId) {
    return Response.json({ message: "Missing targetId" }, { status: 400 })
  }

  await likeReview(targetId)
  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const { targetId } = await req.json()
  if (!targetId) {
    return Response.json({ message: "Missing targetId" }, { status: 400 })
  }

  await unlikeReview(targetId)
  return Response.json({ success: true })
}
