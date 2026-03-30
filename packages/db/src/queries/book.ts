import { asc, count, eq, ilike, or } from "drizzle-orm";
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

export async function searchBooks(query: string, page = 1, limit = 20) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      books: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }

  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  const searchFilter = or(
    ilike(book.title, `%${trimmedQuery}%`), // case-insensitive search in PostgreSQL
    ilike(book.author, `%${trimmedQuery}%`)
  );

  const [books, totalResult] = await Promise.all([
    db.query.book.findMany({
      where: searchFilter,
      orderBy: [asc(book.title)],
      limit,
      offset,
    }),
    db.select({ total: count() }).from(book).where(searchFilter),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    books,
    total,
    totalPages,
    currentPage,
  };
}
