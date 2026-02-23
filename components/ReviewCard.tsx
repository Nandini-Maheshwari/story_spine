"use client";

import { AlertTriangle } from "lucide-react";
import LikeButton from "@/components/LikeButton";
import FollowButton from "@/components/FollowButton";
import type { Review } from "@/types/book";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const isDeleted = review.deleted_at !== null;
  const isAnonymous = !review.is_own_review && review.is_private === true;

  const displayName =
    isDeleted || isAnonymous
      ? "Anonymous reader"
      : review.display_name || review.username;

  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <article className="py-5 border-b border-border last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {displayName}
          </span>
          {review.is_own_review && (
            <span className="px-1.5 py-0.5 text-xs font-medium text-accent bg-accent/10 rounded">
              Your review
            </span>
          )}
          {!isDeleted && !isAnonymous && !review.is_own_review && (
            <FollowButton
              targetUserId={review.user_id}
              initialIsFollowing={review.reviewer_is_following ?? false}
              compact
              skipRefresh
            />
          )}
        </div>
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

      {!isDeleted && (
        <div className="mt-3">
          <LikeButton
            reviewId={review.id}
            likeCount={review.like_count}
            isLiked={review.is_liked}
          />
        </div>
      )}
    </article>
  );
}
