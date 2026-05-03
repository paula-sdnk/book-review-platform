import { auth } from "@book-review-platform/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/trpc-server";
import { ReadingListRow } from "@/components/reading-list-row";

const PREVIEW_LIMIT = 6;

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const caller = await api();

  const [currentlyReading, wantToRead, read] = await Promise.all([
    caller.readingListEntry.getMyReadingListByStatus({
      status: "CURRENTLY_READING",
      limit: PREVIEW_LIMIT,
    }),
    caller.readingListEntry.getMyReadingListByStatus({
      status: "WANT_TO_READ",
      limit: PREVIEW_LIMIT,
    }),
    caller.readingListEntry.getMyReadingListByStatus({
      status: "READ",
      limit: PREVIEW_LIMIT,
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
          My dashboard
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#4b3527]">
          Welcome back, {session.user.name}!
        </h1>

        <h2 className="mt-12 text-2xl font-bold text-[#4b3527]">
          Reading Lists:
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
      </div>
    </main>
  );
}
