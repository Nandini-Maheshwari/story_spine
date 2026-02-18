import { createSupabaseServerClient } from "@/lib/supabase-server"
import {
  getBookPageByGoogleId,
  getBookReviewsByGoogleId,
  getBookReadingCountByGoogleId,
  getUserBookStatusByGoogleId,
} from "@/lib/services/book"
import { fetchGoogleBookById } from "@/lib/google"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ googleBookId: string }> }
) {
  const { googleBookId } = await params
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Try StorySpine DB
  const book = await getBookPageByGoogleId(supabase, googleBookId)

  // If not found → fallback to Google
  if (!book) {
    const googleBook = await fetchGoogleBookById(googleBookId)

    return Response.json({
      source: "google",
      book: googleBook,
      reviews: [],
      readingCount: 0,
      userStatus: null,
    })
  }

  // Fetch StorySpine social data
  const [reviews, readingCount, userStatus] = await Promise.all([
    getBookReviewsByGoogleId(supabase, googleBookId, 10, 0),
    getBookReadingCountByGoogleId(supabase, googleBookId),
    user ? getUserBookStatusByGoogleId(supabase, googleBookId) : null,
  ])

  return Response.json({
    source: "storyspine",
    book,
    reviews,
    readingCount,
    userStatus,
  })
}
