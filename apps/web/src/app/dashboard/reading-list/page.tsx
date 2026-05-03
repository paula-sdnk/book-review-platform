import { auth } from "@book-review-platform/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { Route } from "next";
import Link from "next/link";
import { api } from "@/lib/trpc-server";
import { BookCard } from "@/components/book-card";
import { BookListItem } from "@/components/book-list-item";

type ReadingStatus = "WANT_TO_READ" | "CURRENTLY_READING" | "READ";

const STATUS_LABELS: Record<ReadingStatus, string> = {
  WANT_TO_READ: "Want to Read",
  CURRENTLY_READING: "Currently Reading",
  READ: "Read",
};

const VALID_STATUSES: ReadingStatus[] = [
  "WANT_TO_READ",
  "CURRENTLY_READING",
  "READ",
];

type Props = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

export default async function ReadingListPage({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { status, page } = await searchParams;

  if (!status || !VALID_STATUSES.includes(status as ReadingStatus)) {
    notFound();
  }

  const currentPage = Math.max(1, Number(page) || 1);
  const caller = await api();

  const { entries, total, totalPages } =
    await caller.readingListEntry.getMyReadingListByStatus({
      status: status as ReadingStatus,
      page: currentPage,
    });

  const label = STATUS_LABELS[status as ReadingStatus];

  return (
    <main className="min-h-screen bg-[#f6efe3] px-10 py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="text-sm text-[#b48953] underline underline-offset-4 transition hover:text-[#4b3527]"
        >
          ← Back to dashboard
        </Link>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
          Reading List
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#4b3527]">
          {label}
          <span className="ml-3 text-xl font-normal text-[#a48b78]">
            ({total})
          </span>
        </h1>

        {entries.length === 0 ? (
          <p className="mt-10 text-sm text-[#a48b78]">No books here yet.</p>
        ) : (
          <div className="mt-10">
            <div className="space-y-3">
              {entries.map(({ book }) => {
                const ratings = book.reviews.map((r) => r.rating);
                const averageRating =
                  ratings.length > 0
                    ? Math.round(
                        (ratings.reduce((a, b) => a + b, 0) / ratings.length) *
                          10
                      ) / 10
                    : null;

                return (
                  <BookListItem
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    coverUrl={book.coverUrl}
                    averageRating={averageRating}
                    reviewCount={ratings.length}
                  />
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                {currentPage > 1 && (
                  <Link
                    href={
                      `/dashboard/reading-list?status=${status}&page=${
                        currentPage - 1
                      }` as Route
                    }
                    className="rounded-full border border-[#e7d8bf] bg-[#fffaf2] px-4 py-2 text-sm text-[#4b3527] transition hover:bg-[#f3e7d3]"
                  >
                    ← Previous
                  </Link>
                )}

                <span className="text-sm text-[#a48b78]">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={
                      `/dashboard/reading-list?status=${status}&page=${
                        currentPage + 1
                      }` as Route
                    }
                    className="rounded-full border border-[#e7d8bf] bg-[#fffaf2] px-4 py-2 text-sm text-[#4b3527] transition hover:bg-[#f3e7d3]"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
