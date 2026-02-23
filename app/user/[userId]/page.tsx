import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { User, Heart, Lock } from "lucide-react";
import BookCover from "@/components/BookCover";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getUserProfilePage } from "@/lib/services/profile";
import { canViewUser } from "@/lib/services/social";
import type { Book } from "@/types/book";
import type { UserProfile, UserProfileResponse } from "@/types/profile";
import EditProfileForm from "@/components/EditProfileForm";
import FollowButton from "@/components/FollowButton";
import ProfileStats from "@/components/ProfileStats";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { userId } = await params;

  try {
    const supabase = await createSupabaseServerClient();
    const { profile } = await getUserProfilePage(supabase, userId);
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

function PrivateProfileWall({ profile }: { profile: UserProfile }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="space-y-8">
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
          </div>
        </section>

        <section className="flex flex-col items-center gap-3 py-10 text-center border border-border rounded-xl bg-gray-50">
          <Lock className="w-8 h-8 text-muted" />
          <p className="text-sm font-medium text-foreground">This profile is private.</p>
          <p className="text-sm text-muted">Follow this account to see their books and reviews.</p>
        </section>
      </div>
    </div>
  );
}

function BookShelf({
  title,
  books,
  isOwnProfile,
  emptyMessage,
}: {
  title: string;
  books: Book[];
  isOwnProfile: boolean;
  emptyMessage: string;
}) {
  if (books.length === 0) {
    if (!isOwnProfile) return null;
    return (
      <section>
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </section>
    );
  }

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
            <BookCover
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
              width={120}
              height={180}
              className="rounded-md shadow-sm border border-border"
              placeholderClassName="w-[120px] h-[180px] rounded-md border border-border bg-gray-50 flex items-center justify-center"
              placeholderIconClassName="w-8 h-8 text-muted"
            />
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
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  const canView = await canViewUser(supabase, userId);

  if (!canView) {
    const { data: profileData } = await supabase.rpc("get_user_profile", { p_user_id: userId });
    const profile = profileData?.[0] as UserProfile | undefined;
    if (!profile) notFound();
    return <PrivateProfileWall profile={profile} />;
  }

  const data = await getUserProfilePage(supabase, userId) as UserProfileResponse;
  if (!data?.profile) notFound();

  const { profile, genres, currentlyReading, recentlyFinished, recentReviews } = data;
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
            <ProfileStats
              userId={profile.id}
              isOwnProfile={isOwnProfile}
              followersCount={profile.followers_count}
              followingCount={profile.following_count}
              booksReadCount={profile.books_read_count}
            />
          </div>
        </section>

        {/* Action Area */}
        <div className="flex items-center gap-3">
          {isOwnProfile && (
            <EditProfileForm
              displayName={profile.display_name}
              bio={profile.bio}
              avatarUrl={profile.avatar_url}
              currentGenreNames={genres.map((g: { name: string }) => g.name)}
              isPrivate={profile.is_private}
            />
          )}
          {!isOwnProfile && !profile.is_private && (
            <FollowButton
              targetUserId={profile.id}
              initialIsFollowing={profile.is_following}
            />
          )}
        </div>

        {/* Favorite Genres */}
        {genres.length > 0 ? (
          <section>
            <h2 className="text-lg font-semibold mb-3">Favorite Genres</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre: { name: string }) => (
                <span key={genre.name}>
                  {genre.name}
                </span>
              ))}
            </div>
          </section>
        ) : isOwnProfile ? (
          <section>
            <h2 className="text-lg font-semibold mb-3">Favorite Genres</h2>
            <p className="text-sm text-muted">
              Your favorite genres will appear as you rate books.
            </p>
          </section>
        ) : null}

        {/* Currently Reading */}
        <BookShelf
          title="Currently Reading"
          books={currentlyReading}
          isOwnProfile={isOwnProfile}
          emptyMessage="Start reading a book to see it here."
        />

        {/* Recently Finished */}
        <BookShelf
          title="Recently Finished"
          books={recentlyFinished}
          isOwnProfile={isOwnProfile}
          emptyMessage="Books you finish will appear here."
        />

        {/* Recent Reviews */}
        {recentReviews.length > 0 ? (
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
        ) : isOwnProfile ? (
          <section>
            <h2 className="text-lg font-semibold mb-3">Recent Reviews</h2>
            <p className="text-sm text-muted">
              Your reviews will appear here once you start sharing your thoughts.
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
