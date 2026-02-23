import { createSupabaseServerClient } from "@/lib/supabase-server"
import { toggleProfilePrivacy } from "@/lib/services/social"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { isPrivate } = await req.json()
  if (typeof isPrivate !== "boolean") {
    return Response.json({ error: "isPrivate must be a boolean" }, { status: 400 })
  }

  await toggleProfilePrivacy(supabase, isPrivate)
  return Response.json({ ok: true })
}
