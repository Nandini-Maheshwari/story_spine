import { searchGoogleBooks } from "@/lib/google"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return Response.json({ results: [] })
  }

  const results = await searchGoogleBooks(query.trim())

  return Response.json({ results })
}
