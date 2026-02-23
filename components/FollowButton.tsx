"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  compact?: boolean;
  skipRefresh?: boolean;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  compact = false,
  skipRefresh = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev);

    try {
      const res = await fetch("/api/social/follow", {
        method: prev ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        setIsFollowing(prev);
      } else if (!skipRefresh) {
        router.refresh();
      }
    } catch {
      setIsFollowing(prev);
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-2 py-0.5 text-xs font-medium rounded border transition-colors disabled:opacity-50 ${
          isFollowing
            ? "border-border text-muted hover:text-foreground"
            : "border-accent text-accent hover:bg-accent hover:text-white"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1.5 text-sm font-medium rounded-md border transition-colors disabled:opacity-50 ${
        isFollowing
          ? "border-border text-foreground hover:bg-gray-50"
          : "border-accent bg-accent text-white hover:opacity-90"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
