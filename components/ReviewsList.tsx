import type { Review } from "@/types/book";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

interface ReviewsListProps {
  reviews: Review[];
  googleBookId: string;
}

export default function ReviewsList({ reviews, googleBookId }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Reviews</h2>
          <ReviewForm googleBookId={googleBookId} />
        </div>
        <p className="text-sm text-muted py-4">
          No reviews yet. Be the first to share your thoughts.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">
          Reviews ({reviews.length})
        </h2>
        <ReviewForm googleBookId={googleBookId} />
      </div>
      <div>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
