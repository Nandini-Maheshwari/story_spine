"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

interface EditProfileFormProps {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export default function EditProfileForm({
  displayName,
  bio,
  avatarUrl,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: fields.displayName.trim() || null,
          bio: fields.bio.trim() || null,
          avatarUrl: fields.avatarUrl.trim() || null,
        }),
      });

      if (res.status === 401) {
        setErrorMessage("You must be logged in to edit your profile.");
        setStatus("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
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
          }}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
