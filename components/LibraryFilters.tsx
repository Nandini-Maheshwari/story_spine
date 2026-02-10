"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "tbr", label: "TBR" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
  { value: "paused", label: "Paused" },
  { value: "abandoned", label: "Abandoned" },
];

interface LibraryFiltersProps {
  genres: string[];
  years: number[];
}

export default function LibraryFilters({ genres, years }: LibraryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentStatus = searchParams.get("status") ?? "";
  const currentGenre = searchParams.get("genre") ?? "";
  const currentYear = searchParams.get("year") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("offset");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex gap-1 border-b border-border">
        {STATUS_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => updateParam("status", value)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentStatus === value
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="flex gap-3">
        {genres.length > 0 && (
          <select
            value={currentGenre}
            onChange={(e) => updateParam("genre", e.target.value)}
            className="border border-border rounded-md px-3 py-1.5 text-sm text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}

        {years.length > 0 && (
          <select
            value={currentYear}
            onChange={(e) => updateParam("year", e.target.value)}
            className="border border-border rounded-md px-3 py-1.5 text-sm text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
