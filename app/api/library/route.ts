import { createSupabaseServerClient } from "@/lib/supabase-server"
import { addBookToLibrary, updateLibraryStatus } from "@/lib/services/library"

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

  const bookId = await addBookToLibrary(googleBookId, status)

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

  await updateLibraryStatus(googleBookId, status, progress)

  return Response.json({ success: true })
}
