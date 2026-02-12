import Image from "next/image";
import type { LibraryBook } from "@/types/book";

const STATUS_STYLES: Record<string, string> = {
  tbr: "bg-gray-50 text-gray-700",
  reading: "bg-blue-50 text-blue-700",
  read: "bg-green-50 text-green-700",
  paused: "bg-amber-50 text-amber-700",
  abandoned: "bg-red-50 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  tbr: "TBR",
  reading: "Reading",
  read: "Read",
  paused: "Paused",
  abandoned: "Abandoned",
};

export default function LibraryBookCard({ book }: { book: LibraryBook }) {
  return (
    <div className="flex gap-4 border border-border rounded-md p-4 hover:shadow-sm transition-shadow">
      {book.cover_url ? (
        <Image
          src={book.cover_url}
          alt={`Cover of ${book.title}`}
          width={80}
          height={120}
          className="rounded shrink-0 border border-border object-cover"
          unoptimized
        />
      ) : (
        <div className="w-[80px] h-[120px] rounded shrink-0 bg-gray-100 border border-border" />
      )}

      <div className="flex flex-col gap-2 min-w-0">
        <h3 className="font-semibold text-foreground leading-tight truncate">
          {book.title}
        </h3>

        <span
          className={`self-start px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_STYLES[book.status] ?? "bg-gray-50 text-gray-700"}`}
        >
          {STATUS_LABELS[book.status] ?? book.status}
        </span>

        {book.status === "reading" && book.progress_percent !== null && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${book.progress_percent}%` }}
              />
            </div>
            <span className="text-xs text-muted">{book.progress_percent}%</span>
          </div>
        )}

        {book.note && (
          <p className="text-sm text-muted line-clamp-2">{book.note}</p>
        )}
      </div>
    </div>
  );
}
