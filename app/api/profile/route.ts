import { createSupabaseServerClient } from "@/lib/supabase-server"
import { updateUserProfile } from "@/lib/services/profile"

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  await updateUserProfile(body)

  return Response.json({ success: true })
}
