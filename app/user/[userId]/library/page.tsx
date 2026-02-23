import type { Metadata } from "next";
import type { LibraryBook } from "@/types/book";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { canViewUser } from "@/lib/services/social";
import { getUserLibrary } from "@/lib/services/library";
import { getUserProfilePage } from "@/lib/services/profile";
import LibraryFilters from "@/components/LibraryFilters";
import LibraryBookCard from "@/components/LibraryBookCard";
import { Lock } from "lucide-react";
import Link from "next/link";

interface UserLibraryPageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{
    status?: string;
    genre?: string;
    year?: string;
    offset?: string;
  }>;
}

export async function generateMetadata({ params }: UserLibraryPageProps): Promise<Metadata> {
  const { userId } = await params;
  try {
    const supabase = await createSupabaseServerClient();
    const { profile } = await getUserProfilePage(supabase, userId);
    const name = profile.display_name || profile.username;
    return {
      title: `${name}'s Library | StorySpine`,
      description: `${name}'s reading library on StorySpine`,
    };
  } catch {
    return { title: "Library | StorySpine" };
  }
}

const PAGE_SIZE = 20;

export default async function UserLibraryPage({
  params,
  searchParams,
}: UserLibraryPageProps) {
  const { userId } = await params;
  const sp = await searchParams;

  const supabase = await createSupabaseServerClient();

  const canView = await canViewUser(supabase, userId);

  if (!canView) {
    // Fetch minimal profile data for the heading
    const { data: profileData } = await supabase.rpc("get_user_profile", { p_user_id: userId });
    const profile = profileData?.[0];
    if (!profile) notFound();

    const name = profile.display_name || profile.username;

    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {name}&apos;s Library
            </h1>
          </div>
          <div className="flex flex-col items-center gap-3 py-10 text-center border border-border rounded-xl bg-gray-50">
            <Lock className="w-8 h-8 text-muted" />
            <p className="text-sm font-medium text-foreground">This library is private.</p>
            <p className="text-sm text-muted">Follow this account to see their reading list.</p>
          </div>
        </div>
      </div>
    );
  }

  const offset = Number(sp.offset || 0);
  let books: LibraryBook[] = [];
  try {
    books = await getUserLibrary(
      supabase,
      userId,
      sp.status,
      sp.year ? Number(sp.year) : undefined,
      sp.genre,
      PAGE_SIZE,
      offset
    );
  } catch {
    // Error fetching — show empty
  }

  // Fetch profile name for heading
  const { data: profileData } = await supabase.rpc("get_user_profile", { p_user_id: userId });
  const profile = profileData?.[0];
  const name = profile ? (profile.display_name || profile.username) : "User";

  const hasNext = books.length === PAGE_SIZE;
  const hasPrev = offset > 0;

  const genres = [...new Set(books.flatMap((b) => b.genres))].sort();
  const years = [
    ...new Set(
      books
        .map((b) => (b.started_at ? new Date(b.started_at).getFullYear() : null))
        .filter((y): y is number => y !== null)
    ),
  ].sort((a, b) => b - a);

  function buildPageUrl(newOffset: number) {
    const p = new URLSearchParams();
    if (sp.status) p.set("status", sp.status);
    if (sp.genre) p.set("genre", sp.genre);
    if (sp.year) p.set("year", sp.year);
    if (newOffset > 0) p.set("offset", String(newOffset));
    const qs = p.toString();
    return qs ? `/user/${userId}/library?${qs}` : `/user/${userId}/library`;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {name}&apos;s Library
          </h1>
          <p className="text-sm text-muted mt-1">
            <Link href={`/user/${userId}`} className="hover:text-accent transition-colors">
              ← Back to profile
            </Link>
          </p>
        </div>

        <LibraryFilters genres={genres} years={years} />

        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {books.map((book) => (
              <LibraryBookCard key={book.id} book={book} />
            ))}
          </div>
        ) : sp.status || sp.genre || sp.year ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted">No books match your filters.</p>
            <Link
              href={`/user/${userId}/library`}
              className="text-sm text-accent hover:underline mt-2 inline-block"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-muted">This library is empty.</p>
          </div>
        )}

        {(hasPrev || hasNext) && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            {hasPrev ? (
              <Link
                href={buildPageUrl(Math.max(0, offset - PAGE_SIZE))}
                className="px-4 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-gray-50 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            {hasNext ? (
              <Link
                href={buildPageUrl(offset + PAGE_SIZE)}
                className="px-4 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-gray-50 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
