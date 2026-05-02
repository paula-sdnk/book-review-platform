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

  const { reviews } = await caller.review.getByBookId({ bookId });

  const userAlreadyReviewed = session?.user
    ? reviews.some((r) => r.user.id === session.user.id)
    : false;

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 pt-8 pb-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/books"
          className="mb-3 inline-block text-sm text-[#6b5646] transition hover:text-[#4b3527]"
        >
          ← Back to books
        </Link>

        <div className="rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-8 shadow-sm">
          <div className="flex gap-10">
            <div className="h-[420px] w-[280px] shrink-0 overflow-hidden rounded-xl border border-[#e7d8bf] bg-[#fffdf8]">
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

            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
                Book details
              </p>

              <h1 className="mt-4 text-4xl font-bold text-[#4b3527]">
                {book.title}
              </h1>

              <p className="mt-3 text-xl text-[#6b5646]">{book.author}</p>

              <div className="mt-3">
                <RatingBadge
                  averageRating={book.averageRating}
                  reviewCount={book.reviewCount}
                  size="lg"
                />
              </div>

              <div className="mt-8 space-y-3 text-sm text-[#4b3527]">
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

        <section className="mt-8 rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#4b3527]">Description</h2>

          <div className="mt-4 text-[#6b5646]">
            <BookDescription description={book.description} />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#4b3527]">Reviews</h2>

          <div className="mt-6">
            <ReviewList
              reviews={reviews}
              currentUserId={session?.user.id ?? null}
            />
          </div>

          <div className="mt-8">
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
                <h3 className="mb-4 text-lg font-semibold text-[#4b3527]">
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
