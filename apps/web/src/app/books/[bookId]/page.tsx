import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@book-review-platform/auth";
import { BookDescription } from "@/components/book-description";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { api } from "@/lib/trpc-server";
import { RatingBadge } from "@/components/rating-badge";
import { getGenreLabel } from "@/lib/genres";
import { ReadingListButton } from "@/components/reading-list-button";

type BookDetailsPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { bookId } = await params;

  const [caller, session] = await Promise.all([
    api(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const book = await caller.book.getById({ bookId });

  if (!book) notFound();

  const [{ reviews }, readingListEntry] = await Promise.all([
    caller.review.getByBookId({ bookId }),
    session?.user ? caller.readingListEntry.getEntry({ bookId }) : null,
  ]);

  const userAlreadyReviewed = session?.user
    ? reviews.some((r) => r.user.id === session.user.id)
    : false;

  return (
    <main className="min-h-screen bg-[#f6efe3] px-4 sm:px-6 pt-6 sm:pt-8 pb-14">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl sm:rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-4 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            {/* Cover */}
            <div className="mx-auto sm:mx-0 h-[280px] w-[180px] sm:h-[420px] sm:w-[280px] shrink-0 overflow-hidden rounded-xl border border-[#e7d8bf] bg-[#fffdf8]">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#a48b78]">
                  No cover
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
                Book details
              </p>

              <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl font-bold text-[#4b3527] break-words">
                {book.title}
              </h1>

              <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-[#6b5646]">
                {book.author}
              </p>

              <div className="mt-2 sm:mt-3">
                <RatingBadge
                  averageRating={book.averageRating}
                  reviewCount={book.reviewCount}
                  size="lg"
                />
              </div>

              {session?.user ? (
                <div className="mt-4">
                  <ReadingListButton
                    bookId={bookId}
                    currentStatus={readingListEntry?.status ?? null}
                  />
                </div>
              ) : null}

              <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-sm text-[#4b3527]">
                {book.genre ? (
                  <p>
                    <span className="font-semibold">Genre:</span>{" "}
                    {getGenreLabel(book.genre)}
                  </p>
                ) : null}

                {book.pageCount ? (
                  <p>
                    <span className="font-semibold">Pages:</span>{" "}
                    {book.pageCount}
                  </p>
                ) : null}

                {book.yearPublished ? (
                  <p>
                    <span className="font-semibold">Year published:</span>{" "}
                    {book.yearPublished}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-4 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#4b3527]">
            Description
          </h2>

          <div className="mt-3 sm:mt-4 text-sm sm:text-base text-[#6b5646]">
            <BookDescription description={book.description} />
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-4 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#4b3527]">
            Reviews
          </h2>

          <div className="mt-4 sm:mt-6">
            <ReviewList
              reviews={reviews}
              currentUserId={session?.user.id ?? null}
              currentUserRole={session?.user.role ?? null}
            />
          </div>

          <div className="mt-6 sm:mt-8">
            {!session?.user ? (
              <p className="text-sm text-[#a48b78]">
                <Link
                  href="/login"
                  className="underline transition hover:text-[#4b3527]"
                >
                  Sign in
                </Link>{" "}
                to leave a review.
              </p>
            ) : userAlreadyReviewed ? (
              <p className="text-sm text-[#a48b78]">
                You already reviewed this book.
              </p>
            ) : (
              <>
                <h3 className="mb-3 sm:mb-4 text-lg font-semibold text-[#4b3527]">
                  Write a review
                </h3>
                <ReviewForm mode="create" bookId={bookId} />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
