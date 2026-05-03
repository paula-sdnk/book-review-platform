import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  index,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { book } from "./book";

export const readingStatusEnum = pgEnum("reading_status", [
  "WANT_TO_READ",
  "CURRENTLY_READING",
  "READ",
]);

export type ReadingStatusValue = (typeof readingStatusEnum.enumValues)[number];

export const readingListEntry = pgTable(
  "reading_list_entry",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    bookId: text("book_id")
      .notNull()
      .references(() => book.id, { onDelete: "cascade" }),
    status: readingStatusEnum("status").notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => [
    index("reading_list_entry_user_id_idx").on(table.userId),
    index("reading_list_entry_book_id_idx").on(table.bookId),
    uniqueIndex("reading_list_entry_user_book_idx").on(
      table.userId,
      table.bookId
    ),
  ]
);

export const readingListEntryRelations = relations(
  readingListEntry,
  ({ one }) => ({
    user: one(user, {
      fields: [readingListEntry.userId],
      references: [user.id],
    }),
    book: one(book, {
      fields: [readingListEntry.bookId],
      references: [book.id],
    }),
  })
);
