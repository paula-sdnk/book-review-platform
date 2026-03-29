import { asc, eq, ilike, or } from "drizzle-orm";
import { db } from "../index";
import { book } from "../schema/book";

export async function getBooks(limit = 20) {
  return db.query.book.findMany({
    orderBy: [asc(book.title)],
    limit,
  });
}

export async function getBookById(bookId: string) {
  return db.query.book.findFirst({
    where: eq(book.id, bookId),
  });
}

export async function searchBooks(query: string, limit = 20) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return db.query.book.findMany({
    where: or(
      ilike(book.title, `%${trimmedQuery}%`), // case-insensitive search in PostgreSQL
      ilike(book.author, `%${trimmedQuery}%`)
    ),
    orderBy: [asc(book.title)],
    limit,
  });
}
