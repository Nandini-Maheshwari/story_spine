export default async function DiscoveryFeed() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/home`, { cache: "no-store" })
  const books = await res.json()

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trending Books</h2>

      <pre className="bg-gray-900 text-green-400 p-4 rounded">
        {JSON.stringify(books, null, 2)}
      </pre>
    </div>
  )
}
