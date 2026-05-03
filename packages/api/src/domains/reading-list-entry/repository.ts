import { and, eq } from "drizzle-orm";
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

export async function getUserReadingList(userId: string) {
  return db.query.readingListEntry.findMany({
    where: eq(readingListEntry.userId, userId),
    with: { book: true },
    orderBy: (entry, { desc }) => desc(entry.addedAt),
  });
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
