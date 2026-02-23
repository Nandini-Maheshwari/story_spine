import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getFollowing } from "@/lib/services/social"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const limit = Number(searchParams.get("limit") || 20)
  const offset = Number(searchParams.get("offset") || 0)

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const data = await getFollowing(supabase, userId, limit, offset)
  return Response.json(data)
}
