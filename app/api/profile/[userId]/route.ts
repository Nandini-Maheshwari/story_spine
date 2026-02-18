import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getUserProfilePage } from "@/lib/services/profile"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const supabase = await createSupabaseServerClient()
  const data = await getUserProfilePage(supabase, userId)
  return Response.json(data)
}
