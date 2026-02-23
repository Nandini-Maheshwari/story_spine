"use client";

import { useState } from "react";
import FollowersModal from "@/components/FollowersModal";

interface ProfileStatsProps {
  userId: string;
  isOwnProfile: boolean;
  followersCount: number;
  followingCount: number;
  booksReadCount: number;
}

export default function ProfileStats({
  userId,
  isOwnProfile,
  followersCount,
  followingCount,
  booksReadCount,
}: ProfileStatsProps) {
  const [openTab, setOpenTab] = useState<"followers" | "following" | null>(null);

  return (
    <>
      <div className="flex items-center gap-4 mt-2 text-sm text-muted">
        <button
          onClick={() => setOpenTab("followers")}
          className="hover:text-foreground transition-colors"
        >
          <span className="font-semibold text-foreground">{followersCount}</span> followers
        </button>
        <button
          onClick={() => setOpenTab("following")}
          className="hover:text-foreground transition-colors"
        >
          <span className="font-semibold text-foreground">{followingCount}</span> following
        </button>
        <span>
          <span className="font-semibold text-foreground">{booksReadCount}</span> books read
        </span>
      </div>

      {openTab && (
        <FollowersModal
          userId={userId}
          isOwnProfile={isOwnProfile}
          initialTab={openTab}
          onClose={() => setOpenTab(null)}
        />
      )}
    </>
  );
}
