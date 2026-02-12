import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BookPageResponse } from "@/types/book";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  getBookPageByGoogleId,
  getBookReviewsByGoogleId,
  getBookReadingCountByGoogleId,
  getUserBookStatusByGoogleId,
} from "@/lib/services/book";
import { fetchGoogleBookById } from "@/lib/google";
import BookHeader from "@/components/BookHeader";
import LibraryActions from "@/components/LibraryActions";
import RatingsSummary from "@/components/RatingsSummary";
import RatingForm from "@/components/RatingForm";
import BookSummary from "@/components/BookSummary";
import ReviewsList from "@/components/ReviewsList";

interface BookPageProps {
  params: Promise<{ googleBookId: string }>;
}

async function getBookData(googleBookId: string): Promise<BookPageResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const book = await getBookPageByGoogleId(supabase, googleBookId);

  if (!book) {
    const googleBook = await fetchGoogleBookById(googleBookId);
    return {
      source: "google",
      book: {
        ...googleBook,
        ss_avg_overall: null,
        ss_avg_character: null,
        ss_avg_pacing: null,
        ss_avg_storyline: null,
        ss_avg_writing: null,
        ss_rating_count: null,
      },
      reviews: [],
      readingCount: 0,
      userStatus: null,
    };
  }

  const [reviews, readingCount, userStatus] = await Promise.all([
    getBookReviewsByGoogleId(supabase, googleBookId, 10, 0),
    getBookReadingCountByGoogleId(supabase, googleBookId),
    user ? getUserBookStatusByGoogleId(supabase, googleBookId) : null,
  ]);

  return {
    source: "storyspine",
    book,
    reviews,
    readingCount,
    userStatus,
  };
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { googleBookId } = await params;

  try {
    const { book } = await getBookData(googleBookId);
    return {
      title: `${book.title} | StorySpine`,
      description: book.summary
        ? book.summary.slice(0, 160)
        : `Discover ${book.title} on StorySpine`,
    };
  } catch {
    return { title: "Book | StorySpine" };
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { googleBookId } = await params;
  const data = await getBookData(googleBookId);
  const { source, book, reviews, readingCount, userStatus } = data;

  const ownReview =
    reviews.length > 0 && reviews[0].is_own_review ? reviews[0] : null;

  const existingRatings =
    ownReview && ownReview.user_overall !== null
      ? {
          overall: ownReview.user_overall,
          character: ownReview.user_character,
          pacing: ownReview.user_pacing,
          storyline: ownReview.user_storyline,
          writing: ownReview.user_writing,
          spicy: ownReview.user_spicy,
        }
      : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="space-y-8">
        <BookHeader book={book} />
        <LibraryActions googleBookId={googleBookId} userStatus={userStatus} />
        <RatingsSummary book={book} source={source} readingCount={readingCount} />
        {userStatus?.status === "read" && (
          <RatingForm googleBookId={googleBookId} existingRatings={existingRatings} />
        )}
        <BookSummary summary={book.summary} />
        <ReviewsList
          reviews={reviews}
          googleBookId={googleBookId}
          userStatus={userStatus}
          hasOwnReview={ownReview !== null}
        />
      </div>
    </div>
  );
}
