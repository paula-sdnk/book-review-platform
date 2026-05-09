import { auth } from "@book-review-platform/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/trpc-server";
import { ReadingListRow } from "@/components/reading-list-row";
import { RatingBadge } from "@/components/rating-badge";
import { DashboardReviewCard } from "@/components/dashboard-review-card";

const READING_LIST_PREVIEW_LIMIT = 6;
const REVIEW_PREVIEW_LIMIT = 3;

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const caller = await api();

  const [currentlyReading, wantToRead, read, reviewsDashboard] =
    await Promise.all([
      caller.readingListEntry.getMyReadingListByStatus({
        status: "CURRENTLY_READING",
        limit: READING_LIST_PREVIEW_LIMIT,
      }),
      caller.readingListEntry.getMyReadingListByStatus({
        status: "WANT_TO_READ",
        limit: READING_LIST_PREVIEW_LIMIT,
      }),
      caller.readingListEntry.getMyReadingListByStatus({
        status: "READ",
        limit: READING_LIST_PREVIEW_LIMIT,
      }),
      caller.review.getByUserId({ limit: REVIEW_PREVIEW_LIMIT }),
    ]);

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
          Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#4b3527]">
          Welcome back, {session.user.name}!
        </h1>

        <section className="mt-8 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#e6d5bd] bg-[#f8f2e8] p-5">
              <p className="text-sm font-medium uppercase tracking-wide text-[#9a846d]">
                Review count
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#4b3527]">
                {reviewsDashboard.total}
              </p>
            </div>

            <div className="rounded-xl border border-[#e6d5bd] bg-[#f8f2e8] p-5">
              <p className="text-sm font-medium uppercase tracking-wide text-[#9a846d]">
                Average rating
              </p>

              <div className="mt-3">
                <RatingBadge
                  averageRating={reviewsDashboard.averageRating}
                  reviewCount={reviewsDashboard.total}
                  showReviewCount={false}
                  size="md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[#4b3527]">
            My Reading Lists:
          </h2>

          <div className="mt-4 space-y-10">
            <ReadingListRow
              label="Currently Reading"
              status="CURRENTLY_READING"
              entries={currentlyReading.entries}
              total={currentlyReading.total}
            />
            <ReadingListRow
              label="Want to Read"
              status="WANT_TO_READ"
              entries={wantToRead.entries}
              total={wantToRead.total}
            />
            <ReadingListRow
              label="Read"
              status="READ"
              entries={read.entries}
              total={read.total}
            />
          </div>
        </section>

        <section className="mt-30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#4b3527]">My Reviews</h2>

            {reviewsDashboard.total > REVIEW_PREVIEW_LIMIT && (
              <Link
                href="/dashboard/reviews"
                className="text-sm font-medium text-[#8b5e34] hover:underline"
              >
                See all
              </Link>
            )}
          </div>

          {reviewsDashboard.reviews.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-[#e6d5bd] bg-white p-6">
              <p className="text-[#6b4f3a]">
                You have not written any reviews yet.
              </p>
            </div>
          ) : (
            <div className="mt-4">
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
                {reviewsDashboard.reviews.map((review) => (
                  <DashboardReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
