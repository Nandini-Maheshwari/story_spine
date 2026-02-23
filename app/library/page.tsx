import type { Metadata } from "next";
import type { LibraryBook } from "@/types/book";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserLibrary } from "@/lib/services/library";
import LibraryFilters from "@/components/LibraryFilters";
import LibraryBookCard from "@/components/LibraryBookCard";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Library | StorySpine",
  description: "Your personal reading library on StorySpine",
};

const PAGE_SIZE = 20;

interface LibraryPageProps {
  searchParams: Promise<{
    status?: string;
    genre?: string;
    year?: string;
    offset?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  let books: LibraryBook[] = [];
  try {
    if (user) {
      books = await getUserLibrary(
        supabase,
        user.id,
        params.status,
        params.year ? Number(params.year) : undefined,
        params.genre,
        PAGE_SIZE,
        Number(params.offset || 0)
      );
    }
  } catch {
    // Unauthorized or error — show empty
  }

  const offset = Number(params.offset || 0);
  const hasNext = books.length === PAGE_SIZE;
  const hasPrev = offset > 0;

  // Extract unique genres and years from results for filter dropdowns
  const genres = [...new Set(books.flatMap((b) => b.genres))].sort();
  const years = [
    ...new Set(
      books
        .map((b) => (b.started_at ? new Date(b.started_at).getFullYear() : null))
        .filter((y): y is number => y !== null)
    ),
  ].sort((a, b) => b - a);

  function buildPageUrl(newOffset: number) {
    const p = new URLSearchParams();
    if (params.status) p.set("status", params.status);
    if (params.genre) p.set("genre", params.genre);
    if (params.year) p.set("year", params.year);
    if (newOffset > 0) p.set("offset", String(newOffset));
    const qs = p.toString();
    return qs ? `/library?${qs}` : "/library";
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Library
          </h1>
          <p className="text-sm text-muted mt-1">Your reading journey</p>
        </div>

        {/* Filters */}
        <LibraryFilters genres={genres} years={years} />

        {/* Books grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {books.map((book) => (
              <LibraryBookCard key={book.id} book={book} />
            ))}
          </div>
        ) : params.status || params.genre || params.year ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted">No books match your filters.</p>
            <Link
              href="/library"
              className="text-sm text-accent hover:underline mt-2 inline-block"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">Your library is empty.</p>
            <p className="text-sm text-muted mt-1">
              Search for books to start building your collection.
            </p>
          </div>
        )}

        {/* Pagination */}
        {(hasPrev || hasNext) && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            {hasPrev ? (
              <Link
                href={buildPageUrl(Math.max(0, offset - PAGE_SIZE))}
                className="px-4 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-gray-50 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            {hasNext ? (
              <Link
                href={buildPageUrl(offset + PAGE_SIZE)}
                className="px-4 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-gray-50 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
