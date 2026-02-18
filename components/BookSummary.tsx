"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BookSummaryProps {
  summary: string | null;
}

const COLLAPSE_THRESHOLD = 300;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function BookSummary({ summary }: BookSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  if (!summary) return null;

  const cleanSummary = stripHtml(summary);
  const isLong = cleanSummary.length > COLLAPSE_THRESHOLD;
  const displayText =
    isLong && !expanded
      ? cleanSummary.slice(0, COLLAPSE_THRESHOLD).trimEnd() + "..."
      : cleanSummary;

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Summary</h2>
      <p className="text-foreground leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2 text-sm text-accent hover:underline"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
