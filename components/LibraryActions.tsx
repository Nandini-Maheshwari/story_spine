"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookPlus, BookOpen, CheckCircle, RotateCcw, Play } from "lucide-react";
import type { UserBookStatus } from "@/types/book";
import { STATUS_STYLES, STATUS_LABELS } from "@/lib/constants";

interface LibraryActionsProps {
  googleBookId: string;
  userStatus: UserBookStatus | null;
}

export default function LibraryActions({
  googleBookId,
  userStatus,
}: LibraryActionsProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(
    userStatus?.progress_percent ?? 0
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = userStatus?.status ?? null;

  async function handleStatusChange(
    newStatus: string,
    method: "POST" | "PATCH" = "PATCH"
  ) {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/library", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleBookId, status: newStatus }),
      });

      if (res.status === 401) {
        setError("unauthorized");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const handleProgressChange = useCallback(
    (value: number) => {
      setProgress(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        try {
          await fetch("/api/library", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleBookId,
              status: "reading",
              progress: value,
            }),
          });
        } catch {
          // Silently fail for progress updates
        }
      }, 500);
    },
    [googleBookId]
  );

  if (error === "unauthorized") {
    return (
      <section className="py-3">
        <p className="text-sm text-muted">
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>{" "}
          to add books to your library.
        </p>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-3 py-3">
      {/* Status badge */}
      {status && (
        <span
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
            STATUS_STYLES[status] ?? "bg-gray-50 text-gray-700"
          }`}
        >
          {STATUS_LABELS[status] ?? status}
        </span>
      )}

      {/* Actions by status */}
      {status === null && (
        <button
          onClick={() => handleStatusChange("tbr", "POST")}
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <BookPlus className="w-4 h-4" />
          {submitting ? "Adding..." : "Add to TBR"}
        </button>
      )}

      {status === "tbr" && (
        <button
          onClick={() => handleStatusChange("reading")}
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <BookOpen className="w-4 h-4" />
          {submitting ? "Updating..." : "Start Reading"}
        </button>
      )}

      {status === "reading" && (
        <>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="w-28 h-1.5 accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-muted w-8">{progress}%</span>
          </div>
          <button
            onClick={() => handleStatusChange("read")}
            disabled={submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {submitting ? "Updating..." : "Mark as Read"}
          </button>
        </>
      )}

      {status === "paused" && (
        <button
          onClick={() => handleStatusChange("reading")}
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {submitting ? "Updating..." : "Resume Reading"}
        </button>
      )}

      {status === "abandoned" && (
        <button
          onClick={() => handleStatusChange("reading")}
          disabled={submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          {submitting ? "Updating..." : "Re-read"}
        </button>
      )}

      {/* Error message */}
      {error && error !== "unauthorized" && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </section>
  );
}
