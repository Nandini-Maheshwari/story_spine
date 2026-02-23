import { createSupabaseServerClient } from "@/lib/supabase-server"
import { removeFollower } from "@/lib/services/social"

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { followerId } = await req.json()
  if (!followerId) {
    return Response.json({ error: "followerId is required" }, { status: 400 })
  }

  await removeFollower(supabase, followerId)
  return Response.json({ ok: true })
}
