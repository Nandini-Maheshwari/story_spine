"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";

export interface ExistingRatings {
  overall: number;
  character: number | null;
  pacing: number | null;
  storyline: number | null;
  writing: number | null;
  spicy: number | null;
}

interface RatingFormProps {
  googleBookId: string;
  existingRatings?: ExistingRatings | null;
}

const DIMENSIONS = [
  { key: "overall", label: "Overall", required: true },
  { key: "character", label: "Character", required: false },
  { key: "pacing", label: "Pacing", required: false },
  { key: "storyline", label: "Storyline", required: false },
  { key: "writing", label: "Writing", required: false },
  { key: "spicy", label: "Spicy", required: false },
] as const;

type DimensionKey = (typeof DIMENSIONS)[number]["key"];

function StarRow({
  label,
  value,
  required,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  required: boolean;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted w-24 shrink-0">
        {label}
        {required && !disabled && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      <div className="flex gap-0.5" onMouseLeave={() => !disabled && setHover(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            className="p-0.5 disabled:cursor-default"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= (hover || value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs text-muted">{value}/5</span>
      )}
    </div>
  );
}

export default function RatingForm({ googleBookId, existingRatings }: RatingFormProps) {
  const router = useRouter();
  const [ratings, setRatings] = useState<Record<DimensionKey, number>>({
    overall: 0,
    character: 0,
    pacing: 0,
    storyline: 0,
    writing: 0,
    spicy: 0,
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "unauthorized"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(key: DimensionKey, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (ratings.overall === 0) return;

    setStatus("submitting");
    setErrorMessage("");

    // Build payload — only include non-zero optional dimensions
    const payload: Record<string, string | number> = {
      googleBookId,
      overall: ratings.overall,
    };

    for (const dim of DIMENSIONS) {
      if (!dim.required && ratings[dim.key] > 0) {
        payload[dim.key] = ratings[dim.key];
      }
    }

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setStatus("unauthorized");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit rating");
      }

      setStatus("success");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  if (existingRatings) {
    return (
      <section className="py-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">Your rating</h2>
        <div className="space-y-3">
          {DIMENSIONS.map((dim) => {
            const value = existingRatings[dim.key];
            if (value === null || value === undefined || value === 0) return null;
            return (
              <StarRow
                key={dim.key}
                label={dim.label}
                value={value}
                required={dim.required}
                onChange={() => {}}
                disabled={true}
              />
            );
          })}
        </div>
      </section>
    );
  }

  if (status === "unauthorized") {
    return (
      <section className="py-4">
        <p className="text-sm text-muted">
          <Link href="/login" className="text-accent hover:underline">
            Log in
          </Link>{" "}
          to rate this book.
        </p>
      </section>
    );
  }

  if (status === "success") {
    return (
      <section className="py-4">
        <p className="text-sm text-muted">Thanks for rating this book.</p>
      </section>
    );
  }

  const isDisabled = status === "submitting";

  return (
    <section className="py-4 border-t border-border">
      <h2 className="text-lg font-semibold mb-4">Rate this book</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {DIMENSIONS.map((dim) => (
          <StarRow
            key={dim.key}
            label={dim.label}
            value={ratings[dim.key]}
            required={dim.required}
            onChange={(v) => handleChange(dim.key, v)}
            disabled={isDisabled}
          />
        ))}

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isDisabled || ratings.overall === 0}
          className="px-4 py-1.5 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isDisabled ? "Submitting..." : "Submit Rating"}
        </button>
      </form>
    </section>
  );
}
