import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { User, Heart, BookOpen } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { UserProfileResponse } from "@/types/profile";
import type { Book } from "@/types/book";
import EditProfileForm from "@/components/EditProfileForm";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

async function getProfileData(userId: string): Promise<UserProfileResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/profile/${userId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { userId } = await params;

  try {
    const { profile } = await getProfileData(userId);
    const name = profile.display_name || profile.username;
    return {
      title: `${name} | StorySpine`,
      description: profile.bio
        ? profile.bio.slice(0, 160)
        : `${name}'s profile on StorySpine`,
    };
  } catch {
    return { title: "Profile | StorySpine" };
  }
}

function BookShelf({ title, books }: { title: string; books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {books.slice(0, 6).map((book) => (
          <Link
            key={book.google_book_id}
            href={`/books/${book.google_book_id}`}
            className="shrink-0 w-[120px] group"
          >
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                width={120}
                height={180}
                className="rounded-md shadow-sm border border-border"
                unoptimized
              />
            ) : (
              <div className="w-[120px] h-[180px] rounded-md border border-border bg-gray-50 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted" />
              </div>
            )}
            <p className="mt-1.5 text-xs text-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {book.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function UserPage({ params }: UserPageProps) {
  const { userId } = await params;
  const data = await getProfileData(userId);
  const { profile, genres, currentlyReading, recentlyFinished, recentReviews } = data;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="space-y-8">
        {/* Profile Header */}
        <section className="flex gap-6">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                width={80}
                height={80}
                className="rounded-full border border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border border-border bg-gray-50 flex items-center justify-center">
                <User className="w-8 h-8 text-muted" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-sm text-muted">@{profile.username}</p>
            {profile.bio && (
              <p className="text-sm text-foreground leading-relaxed mt-1">
                {profile.bio}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted">
              <span>
                <span className="font-semibold text-foreground">{profile.followers_count}</span> followers
              </span>
              <span>
                <span className="font-semibold text-foreground">{profile.following_count}</span> following
              </span>
              <span>
                <span className="font-semibold text-foreground">{profile.books_read_count}</span> books read
              </span>
            </div>
          </div>
        </section>

        {/* Action Area */}
        {isOwnProfile && (
          <EditProfileForm
            displayName={profile.display_name}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
          />
        )}

        {/* Favorite Genres */}
        {genres.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Favorite Genres</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-muted border border-border"
                >
                  {genre}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Currently Reading */}
        <BookShelf title="Currently Reading" books={currentlyReading} />

        {/* Recently Finished */}
        <BookShelf title="Recently Finished" books={recentlyFinished} />

        {/* Recent Reviews */}
        {recentReviews.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Recent Reviews</h2>
            <div>
              {recentReviews.map((review) => {
                const formattedDate = new Date(review.created_at).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                );

                return (
                  <article
                    key={review.id}
                    className="py-4 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Link
                        href={`/books/${review.google_book_id}`}
                        className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {review.book_title}
                      </Link>
                      <span className="text-xs text-muted">{formattedDate}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                      {review.content}
                    </p>
                    {review.like_count > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{review.like_count}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
