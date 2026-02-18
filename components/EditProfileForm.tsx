"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface EditProfileFormProps {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  currentGenreNames: string[];
}

export default function EditProfileForm({
  displayName,
  bio,
  avatarUrl,
  currentGenreNames,
}: EditProfileFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    displayName: displayName ?? "",
    bio: bio ?? "",
    avatarUrl: avatarUrl ?? "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<number>>(new Set());
  const [genresLoaded, setGenresLoaded] = useState(false);

  useEffect(() => {
    if (!open || genresLoaded) return;

    fetch("/api/preferences")
      .then((res) => res.json())
      .then((genres: Genre[]) => {
        setAllGenres(genres);
        const preSelected = new Set(
          genres
            .filter((g) => currentGenreNames.includes(g.name))
            .map((g) => g.id)
        );
        setSelectedGenreIds(preSelected);
        setGenresLoaded(true);
      })
      .catch(() => {
        // Silently fail — genres section just won't show
      });
  }, [open, genresLoaded, currentGenreNames]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md text-foreground hover:bg-gray-50 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit profile
      </button>
    );
  }

  function toggleGenre(id: number) {
    setSelectedGenreIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const [profileRes, genresRes] = await Promise.all([
        fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: fields.displayName.trim() || null,
            bio: fields.bio.trim() || null,
            avatarUrl: fields.avatarUrl.trim() || null,
          }),
        }),
        fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genreIds: Array.from(selectedGenreIds),
          }),
        }),
      ]);

      if (profileRes.status === 401 || genresRes.status === 401) {
        setErrorMessage("You must be logged in to edit your profile.");
        setStatus("error");
        return;
      }

      if (!profileRes.ok) {
        const data = await profileRes.json();
        throw new Error(data.message || "Failed to update profile");
      }

      if (!genresRes.ok) {
        const data = await genresRes.json();
        throw new Error(data.message || "Failed to update genres");
      }

      setOpen(false);
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 border-t border-border">
      <div className="space-y-1">
        <label htmlFor="displayName" className="text-sm font-medium text-foreground">
          Display name
        </label>
        <input
          id="displayName"
          type="text"
          value={fields.displayName}
          onChange={(e) => setFields((f) => ({ ...f, displayName: e.target.value }))}
          placeholder="Your display name"
          className="w-full border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </label>
        <textarea
          id="bio"
          value={fields.bio}
          onChange={(e) => setFields((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Tell readers about yourself..."
          rows={3}
          className="w-full border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent resize-y"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="avatarUrl" className="text-sm font-medium text-foreground">
          Avatar URL
        </label>
        <input
          id="avatarUrl"
          type="url"
          value={fields.avatarUrl}
          onChange={(e) => setFields((f) => ({ ...f, avatarUrl: e.target.value }))}
          placeholder="https://example.com/avatar.jpg"
          className="w-full border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Genre Preferences */}
      {allGenres.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Favorite genres
          </label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => {
              const selected = selectedGenreIds.has(genre.id);
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selected
                      ? "bg-accent text-white border-accent"
                      : "border-border text-muted hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-4 py-1.5 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "submitting" ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setStatus("idle");
            setErrorMessage("");
            setFields({
              displayName: displayName ?? "",
              bio: bio ?? "",
              avatarUrl: avatarUrl ?? "",
            });
            setGenresLoaded(false);
          }}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
