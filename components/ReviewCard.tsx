import { Heart, AlertTriangle } from "lucide-react";
import type { Review } from "@/types/book";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const isDeleted = review.deleted_at !== null;

  const displayName = isDeleted
    ? "Anonymous reader"
    : review.display_name || review.username;

  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <article className="py-5 border-b border-border last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {displayName}
        </span>
        <span className="text-xs text-muted">{formattedDate}</span>
      </div>

      {review.spoiler && !isDeleted && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Contains spoilers</span>
        </div>
      )}

      <p className="text-foreground leading-relaxed text-sm">
        {isDeleted ? (
          <span className="italic text-muted">
            This review has been removed.
          </span>
        ) : (
          review.content
        )}
      </p>

      {review.like_count > 0 && !isDeleted && (
        <div className="flex items-center gap-1 mt-3 text-xs text-muted">
          <Heart className="w-3.5 h-3.5" />
          <span>{review.like_count}</span>
        </div>
      )}
    </article>
  );
}
