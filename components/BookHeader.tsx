import Image from "next/image";
import type { Book } from "@/types/book";

interface BookHeaderProps {
  book: Book;
}

export default function BookHeader({ book }: BookHeaderProps) {
  return (
    <section className="flex gap-8">
      {book.cover_url && (
        <div className="shrink-0">
          <Image
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            width={180}
            height={270}
            className="rounded-md shadow-sm border border-border"
            unoptimized
          />
        </div>
      )}

      <div className="flex flex-col justify-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {book.title}
        </h1>

        {book.authors && (
          <p className="text-lg text-muted">by {book.authors}</p>
        )}

        <div className="flex items-center gap-3 text-sm text-muted">
          {book.published_year && <span>{book.published_year}</span>}
          {book.language && (
            <span className="uppercase">{book.language}</span>
          )}
        </div>

        {book.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-muted border border-border"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
