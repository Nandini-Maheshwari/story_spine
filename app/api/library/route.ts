import { createSupabaseServerClient } from "@/lib/supabase-server"
import { fetchGoogleBookById } from "@/lib/google"

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()
  const { googleBookId, status } = body

  if (!googleBookId || !status) {
    return Response.json(
      { message: "Missing googleBookId or status" },
      { status: 400 }
    )
  }

  // Fetch metadata from Google
  const book = await fetchGoogleBookById(googleBookId)

  // Call DB RPC (this is the only write)
  const { data, error } = await supabase.rpc("add_book_to_library", {
    p_google_book_id: book.google_book_id,
    p_title: book.title,
    p_authors: book.authors,
    p_cover_url: book.cover_url,
    p_summary: book.summary,
    p_published_year: book.published_year,
    p_language: book.language,
    p_genres: book.genres,
    p_status: status,
  })

  if (error) throw error

  return Response.json({
    success: true,
    bookId: data,
    status,
  })
}


export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const { error } = await supabase.rpc(
    "update_reading_status_by_google_id",
    {
      p_google_book_id: googleBookId,
      p_status: status,
      p_progress: progress ?? null,
    }
  )

  if (error) throw error

  return Response.json({ success: true })
}
