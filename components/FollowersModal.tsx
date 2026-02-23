"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, User } from "lucide-react";
import type { SocialUser } from "@/types/profile";

interface FollowersModalProps {
  userId: string;
  isOwnProfile: boolean;
  initialTab: "followers" | "following";
  onClose: () => void;
}

const PAGE_SIZE = 20;

export default function FollowersModal({
  userId,
  isOwnProfile,
  initialTab,
  onClose,
}: FollowersModalProps) {
  const [tab, setTab] = useState<"followers" | "following">(initialTab);
  const [followers, setFollowers] = useState<SocialUser[]>([]);
  const [following, setFollowing] = useState<SocialUser[]>([]);
  const [followersOffset, setFollowersOffset] = useState(0);
  const [followingOffset, setFollowingOffset] = useState(0);
  const [followersHasMore, setFollowersHasMore] = useState(false);
  const [followingHasMore, setFollowingHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [unfollowing, setUnfollowing] = useState<string | null>(null);

  const fetchFollowers = useCallback(async (offset: number, replace = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/social/followers?userId=${userId}&limit=${PAGE_SIZE}&offset=${offset}`
      );
      const data: SocialUser[] = await res.json();
      setFollowers((prev) => (replace ? data : [...prev, ...data]));
      setFollowersOffset(offset + data.length);
      setFollowersHasMore(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchFollowing = useCallback(async (offset: number, replace = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/social/following?userId=${userId}&limit=${PAGE_SIZE}&offset=${offset}`
      );
      const data: SocialUser[] = await res.json();
      setFollowing((prev) => (replace ? data : [...prev, ...data]));
      setFollowingOffset(offset + data.length);
      setFollowingHasMore(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (tab === "followers") {
      fetchFollowers(0, true);
    } else {
      fetchFollowing(0, true);
    }
  }, [tab, fetchFollowers, fetchFollowing]);

  async function handleUnfollow(targetId: string) {
    setUnfollowing(targetId);
    try {
      const res = await fetch("/api/social/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: targetId }),
      });
      if (res.ok) {
        setFollowing((prev) => prev.filter((u) => u.id !== targetId));
      }
    } finally {
      setUnfollowing(null);
    }
  }

  async function handleRemove(followerId: string) {
    setRemoving(followerId);
    try {
      const res = await fetch("/api/social/remove-follower", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId }),
      });
      if (res.ok) {
        setFollowers((prev) => prev.filter((u) => u.id !== followerId));
      }
    } finally {
      setRemoving(null);
    }
  }

  const list = tab === "followers" ? followers : following;
  const hasMore = tab === "followers" ? followersHasMore : followingHasMore;

  function loadMore() {
    if (tab === "followers") {
      fetchFollowers(followersOffset);
    } else {
      fetchFollowing(followingOffset);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setTab("followers")}
              className={`text-sm font-medium pb-0.5 ${
                tab === "followers"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted hover:text-foreground transition-colors"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setTab("following")}
              className={`text-sm font-medium pb-0.5 ${
                tab === "following"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted hover:text-foreground transition-colors"
              }`}
            >
              Following
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-5 py-3 space-y-3">
          {list.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {u.avatar_url ? (
                  <Image
                    src={u.avatar_url}
                    alt={u.display_name || u.username}
                    width={36}
                    height={36}
                    className="rounded-full border border-border shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border border-border bg-gray-50 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-muted" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {u.display_name || u.username}
                  </p>
                  <p className="text-xs text-muted truncate">@{u.username}</p>
                </div>
              </div>
              {isOwnProfile && tab === "followers" && (
                <button
                  onClick={() => handleRemove(u.id)}
                  disabled={removing === u.id}
                  className="shrink-0 px-3 py-1 text-xs font-medium border border-border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}
              {isOwnProfile && tab === "following" && (
                <button
                  onClick={() => handleUnfollow(u.id)}
                  disabled={unfollowing === u.id}
                  className="shrink-0 px-3 py-1 text-xs font-medium border border-border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Unfollow
                </button>
              )}
            </div>
          ))}

          {loading && (
            <p className="text-sm text-muted text-center py-4">Loading…</p>
          )}

          {!loading && list.length === 0 && (
            <p className="text-sm text-muted text-center py-6">
              {tab === "followers" ? "No followers yet." : "Not following anyone yet."}
            </p>
          )}
        </div>

        {/* Load more */}
        {hasMore && !loading && (
          <div className="px-5 py-3 border-t border-border">
            <button
              onClick={loadMore}
              className="w-full text-sm text-accent hover:underline"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
