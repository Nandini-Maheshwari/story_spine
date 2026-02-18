import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getUserLibrary, addBookToLibrary, updateLibraryStatus } from "@/lib/services/library"

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || undefined
  const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined
  const genre = searchParams.get("genre") || undefined
  const limit = Number(searchParams.get("limit") || 20)
  const offset = Number(searchParams.get("offset") || 0)

  const data = await getUserLibrary(supabase, status, year, genre, limit, offset)
  return Response.json(data)
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { googleBookId, status } = await req.json()
  if (!googleBookId || !status) {
    return Response.json(
      { message: "Missing googleBookId or status" },
      { status: 400 }
    )
  }

  const bookId = await addBookToLibrary(supabase, googleBookId, status)

  return Response.json({
    success: true,
    bookId,
    status,
  })
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { googleBookId, status, progress } = await req.json()

  if (!googleBookId || !status) {
    return Response.json(
      { message: "Missing googleBookId or status" },
      { status: 400 }
    )
  }

  await updateLibraryStatus(supabase, googleBookId, status, progress)

  return Response.json({ success: true })
}
