import { and, eq, count } from "drizzle-orm";
import { db, readingListEntry } from "@book-review-platform/db";
import type { ReadingStatusValue } from "@book-review-platform/db";

export async function getReadingListEntry(userId: string, bookId: string) {
  return db.query.readingListEntry.findFirst({
    where: and(
      eq(readingListEntry.userId, userId),
      eq(readingListEntry.bookId, bookId)
    ),
  });
}

export async function getUserReadingListByStatus(
  userId: string,
  status: ReadingStatusValue,
  page = 1,
  limit = 20
) {
  const offset = (page - 1) * limit;

  const [entries, totalResult] = await Promise.all([
    db.query.readingListEntry.findMany({
      where: and(
        eq(readingListEntry.userId, userId),
        eq(readingListEntry.status, status)
      ),
      with: {
        book: {
          with: {
            reviews: {
              columns: { rating: true },
            },
          },
        },
      },
      orderBy: (entry, { desc }) => desc(entry.addedAt),
      limit,
      offset,
    }),
    db
      .select({ total: count() })
      .from(readingListEntry)
      .where(
        and(
          eq(readingListEntry.userId, userId),
          eq(readingListEntry.status, status)
        )
      ),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return { entries, total, totalPages, currentPage: page };
}

export async function upsertReadingListEntry(
  userId: string,
  bookId: string,
  status: ReadingStatusValue
) {
  await db
    .insert(readingListEntry)
    .values({ id: crypto.randomUUID(), userId, bookId, status })
    .onConflictDoUpdate({
      target: [readingListEntry.userId, readingListEntry.bookId],
      set: { status },
    });
}

export async function deleteReadingListEntry(userId: string, bookId: string) {
  await db
    .delete(readingListEntry)
    .where(
      and(
        eq(readingListEntry.userId, userId),
        eq(readingListEntry.bookId, bookId)
      )
    );
}
