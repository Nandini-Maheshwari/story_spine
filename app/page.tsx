import { getTrendingBooks } from "@/lib/services/home"

export default async function Home() {
  const books = await getTrendingBooks()

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Trending Books</h1>

      <pre className="bg-gray-900 text-green-400 p-4 rounded">
        {JSON.stringify(books, null, 2)}
      </pre>
    </div>
  )
}
