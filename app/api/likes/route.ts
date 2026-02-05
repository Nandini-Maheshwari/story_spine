import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const { targetType, targetId } = await req.json()
  if (!targetType || !targetId) {
    return Response.json({ message: "Missing targetType or targetId" }, { status: 400 })
  }

  const { error } = await supabase.rpc("like_review", {
    p_review_id: targetId,
  })
  if (error) throw error

  return Response.json({ success: true })
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 })

  const { targetType, targetId } = await req.json()
  if (!targetType || !targetId) {
    return Response.json({ message: "Missing targetType or targetId" }, { status: 400 })
  }

  const { error } = await supabase.rpc("unlike_review", {
    p_review_id: targetId,
  })
  if (error) throw error

  return Response.json({ success: true })
}
