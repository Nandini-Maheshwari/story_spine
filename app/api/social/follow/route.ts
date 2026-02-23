import { createSupabaseServerClient } from "@/lib/supabase-server"
import { followUser, unfollowUser } from "@/lib/services/social"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { targetUserId } = await req.json()
  if (!targetUserId) {
    return Response.json({ error: "targetUserId is required" }, { status: 400 })
  }

  await followUser(supabase, targetUserId)
  return Response.json({ ok: true })
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { targetUserId } = await req.json()
  if (!targetUserId) {
    return Response.json({ error: "targetUserId is required" }, { status: 400 })
  }

  await unfollowUser(supabase, targetUserId)
  return Response.json({ ok: true })
}
