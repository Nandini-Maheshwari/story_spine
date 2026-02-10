import { Star, Users } from "lucide-react";
import type { Book } from "@/types/book";

interface RatingsSummaryProps {
  book: Book;
  source: "google" | "storyspine";
  readingCount: number;
}

const RATING_DIMENSIONS = [
  { key: "ss_avg_overall", label: "Overall" },
  { key: "ss_avg_character", label: "Character" },
  { key: "ss_avg_pacing", label: "Pacing" },
  { key: "ss_avg_storyline", label: "Storyline" },
  { key: "ss_avg_writing", label: "Writing" },
] as const;

function RatingBar({ label, value }: { label: string; value: number }) {
  const percentage = (value / 5) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted w-24 shrink-0">{label}</span>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-40">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function RatingsSummary({
  book,
  source,
  readingCount,
}: RatingsSummaryProps) {
  const hasGoogleRating =
    book.google_avg_rating !== null && book.google_rating_count !== null;

  const hasStorySpineRatings =
    source === "storyspine" &&
    book.ss_rating_count !== null &&
    book.ss_rating_count > 0;

  if (!hasGoogleRating && !hasStorySpineRatings && readingCount === 0) {
    return null;
  }

  return (
    <section className="flex justify-between items-start py-4 border-y border-border">
      {/* Left: StorySpine community bars */}
      {hasStorySpineRatings && (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Community ({book.ss_rating_count!.toLocaleString()}{" "}
            {book.ss_rating_count === 1 ? "rating" : "ratings"})
          </p>
          <div className="space-y-2">
            {RATING_DIMENSIONS.map(({ key, label }) => {
              const value = book[key];
              if (value === null || value === undefined) return null;
              return <RatingBar key={key} label={label} value={Number(value)} />;
            })}
          </div>
        </div>
      )}

      {/* Right: Google rating + reader count */}
      <div className="flex flex-col items-end gap-3">
        {hasGoogleRating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-lg font-semibold">
                {book.google_avg_rating!.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-muted">
              Google ({book.google_rating_count!.toLocaleString()} ratings)
            </span>
          </div>
        )}

        {readingCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Users className="w-4 h-4" />
            <span>
              {readingCount} {readingCount === 1 ? "reader" : "readers"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
