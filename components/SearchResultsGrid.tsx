"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import type { GoogleSearchResult } from "@/lib/google"

interface SearchResultsGridProps {
  results: GoogleSearchResult[]
  query: string
}

export default function SearchResultsGrid({ results, query }: SearchResultsGridProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">
          No books found for &ldquo;{query}&rdquo;
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-muted mb-6">
        {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {results.map((book) => (
          <Link
            key={book.google_book_id}
            href={`/books/${book.google_book_id}`}
            className="group"
          >
            <div className="relative aspect-2/3 mb-2.5 rounded overflow-hidden border border-border bg-gray-50">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                  No cover
                </div>
              )}
            </div>

            <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {book.title}
            </h3>

            {book.authors && (
              <p className="text-xs text-muted mt-0.5 truncate">
                {book.authors}
              </p>
            )}

            {book.google_avg_rating != null && (
              <div className="flex items-center gap-0.5 mt-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted">
                  {book.google_avg_rating.toFixed(1)}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
