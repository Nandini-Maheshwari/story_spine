import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getTrendingBooks, getPersonalizedFeed } from "@/lib/services/home"

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const books = user
    ? await getPersonalizedFeed(supabase)
    : await getTrendingBooks(supabase)

  return Response.json(books)
}
