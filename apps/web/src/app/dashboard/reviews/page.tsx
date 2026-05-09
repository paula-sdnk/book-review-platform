import { auth } from "@book-review-platform/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Route } from "next";
import Link from "next/link";
import { api } from "@/lib/trpc-server";
import { DashboardReviewCard } from "@/components/dashboard-review-card";

const PAGE_LIMIT = 10;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function DashboardReviewsPage({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const caller = await api();

  const { reviews, total, totalPages } = await caller.review.getByUserId({
    page: currentPage,
    limit: PAGE_LIMIT,
  });

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
          My reviews
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#4b3527]">
          Reviews
          <span className="ml-3 text-xl font-normal text-[#a48b78]">
            ({total})
          </span>
        </h1>

        {reviews.length === 0 ? (
          <p className="mt-10 text-sm text-[#a48b78]">
            You have not written any reviews yet.
          </p>
        ) : (
          <div className="mt-10">
            <div className="grid grid-cols-[64px_2fr_1fr_2fr_1fr] gap-4 px-4 pb-2">
              <div />
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9a846d]">
                Title
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9a846d]">
                Rating
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9a846d]">
                Review
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9a846d]">
                Date
              </p>
            </div>

            <div className="space-y-2">
              {reviews.map((review) => (
                <DashboardReviewCard key={review.id} review={review} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                {currentPage > 1 && (
                  <Link
                    href={`/dashboard/reviews?page=${currentPage - 1}` as Route}
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
                    href={`/dashboard/reviews?page=${currentPage + 1}` as Route}
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
