import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BookPageResponse } from "@/types/book";
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/books/${googleBookId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(`Failed to fetch book data: ${res.status}`);
  }

  return res.json();
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="space-y-8">
        <BookHeader book={book} />
        <LibraryActions googleBookId={googleBookId} userStatus={userStatus} />
        <RatingsSummary book={book} source={source} readingCount={readingCount} />
        {userStatus?.status === "read" && (
          <RatingForm googleBookId={googleBookId} />
        )}
        <BookSummary summary={book.summary} />
        <ReviewsList
          reviews={reviews}
          googleBookId={googleBookId}
          userStatus={userStatus}
        />
      </div>
    </div>
  );
}
