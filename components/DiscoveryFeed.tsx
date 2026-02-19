import Link from "next/link";
import { BookOpen } from "lucide-react";
import BookCover from "@/components/BookCover";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getTrendingBooks, getPersonalizedFeed } from "@/lib/services/home";

interface TrendingBook {
  id: number;
  google_book_id: string;
  title: string;
  authors: string | null;
  cover_url: string | null;
  activity_score: number;
}

export default async function DiscoveryFeed() {
  let books: TrendingBook[] = [];
  let error = false;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    books = user
      ? await getPersonalizedFeed(supabase)
      : await getTrendingBooks(supabase);
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Trending Books</h2>
        <p className="text-sm text-muted py-12 text-center">
          Unable to load recommendations right now.
        </p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Trending Books</h2>
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">
            No trending books yet. Start by searching for books you love.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trending Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.google_book_id}`}
            className="group"
          >
            <div className="relative aspect-2/3 mb-2.5 rounded overflow-hidden border border-border bg-gray-50">
              <BookCover
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                placeholderClassName="w-full h-full flex items-center justify-center text-muted text-xs"
                placeholderText="No cover"
              />
            </div>

            <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {book.title}
            </h3>

            {book.authors && (
              <p className="text-xs text-muted mt-0.5 truncate">
                {book.authors}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
