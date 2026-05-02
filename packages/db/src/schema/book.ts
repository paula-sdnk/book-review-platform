import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, integer, index } from "drizzle-orm/pg-core";
import { review } from "./review";
import { readingListEntry } from "./reading-list-entry";

export const bookGenreEnum = pgEnum("book_genre", [
  "FICTION",
  "FANTASY",
  "SCIENCE_FICTION",
  "MYSTERY_THRILLER",
  "ROMANCE",
  "HORROR",
  "HISTORICAL_FICTION",
  "LITERARY_FICTION",
  "YOUNG_ADULT",
  "CHILDREN",
  "BIOGRAPHY",
  "SELF_HELP",
  "SCIENCE",
  "HISTORY",
  "PHILOSOPHY",
  "POETRY",
  "COMICS_GRAPHIC_NOVELS",
  "TRUE_CRIME",
  "BUSINESS",
  "OTHER",
]);

export const book = pgTable(
  "book",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    description: text("description").notNull(),
    coverUrl: text("coverUrl"),
    genre: bookGenreEnum("genre"),
    pageCount: integer("pageCount"),
    yearPublished: integer("yearPublished"),
    googleBooksId: text("google_books_id").unique(),
  },
  (table) => [
    index("book_title_idx").on(table.title),
    index("book_genre_idx").on(table.genre),
  ]
);

export const bookRelations = relations(book, ({ many }) => ({
  reviews: many(review),
  readingListEntries: many(readingListEntry),
}));
