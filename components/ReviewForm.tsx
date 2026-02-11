"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

interface ReviewFormProps {
  googleBookId: string;
}

export default function ReviewForm({ googleBookId }: ReviewFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-accent hover:underline"
      >
        <Pencil className="w-3.5 h-3.5" />
        Write a review
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleBookId, content: content.trim(), spoiler }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to post review");
      }

      setStatus("success");
      setContent("");
      setSpoiler(false);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts about this book..."
        rows={4}
        className="w-full border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-y"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="spoiler"
          checked={spoiler}
          onChange={(e) => setSpoiler(e.target.checked)}
          className="accent-accent"
        />
        <label htmlFor="spoiler" className="text-sm text-muted">
          Contains spoilers
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting" || !content.trim()}
          className="px-4 py-1.5 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "submitting" ? "Posting..." : "Post review"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setStatus("idle");
            setErrorMessage("");
          }}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
