import { relations } from "drizzle-orm";
import { pgTable, text, integer, index } from "drizzle-orm/pg-core";
import { review } from "./review";
import { readingListEntry } from "./reading-list-entry";

export const book = pgTable(
  "book",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    description: text("description").notNull(),
    coverUrl: text("coverUrl"),
    genre: text("genre"),
    pageCount: integer("pageCount"),
    yearPublished: integer("yearPublished"),
    googleBooksId: text("google_books_id").unique(),
  },
  (table) => [index("book_title_idx").on(table.title)]
);

export const bookRelations = relations(book, ({ many }) => ({
  reviews: many(review),
  readingListEntries: many(readingListEntry),
}));
