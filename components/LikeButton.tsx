"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  reviewId: number;
  likeCount: number;
  isLiked: boolean;
}

export default function LikeButton({
  reviewId,
  likeCount,
  isLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (pending) return;

    const wasLiked = liked;
    const prevCount = count;

    // Optimistic update
    setLiked(!wasLiked);
    setCount(wasLiked ? prevCount - 1 : prevCount + 1);
    setPending(true);

    try {
      const res = await fetch("/api/likes", {
        method: wasLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: reviewId }),
      });

      if (!res.ok) {
        // Revert on failure
        setLiked(wasLiked);
        setCount(prevCount);
      }
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setCount(prevCount);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors disabled:opacity-50"
    >
      <Heart
        className={`w-3.5 h-3.5 ${
          liked ? "fill-red-500 text-red-500" : ""
        }`}
      />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
