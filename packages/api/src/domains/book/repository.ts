import { asc, count, eq, ilike, or, sql } from "drizzle-orm";
import { db, book } from "@book-review-platform/db";

export async function getBookById(bookId: string) {
  return db.query.book.findFirst({
    where: eq(book.id, bookId),
  });
}

export async function getBookByTitleAndAuthor(title: string, author: string) {
  return db.query.book.findFirst({
    where: sql`lower(${book.title}) = lower(${title}) and lower(${book.author}) = lower(${author})`,
    columns: {
      id: true,
    },
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
    ilike(book.title, `%${trimmedQuery}%`),
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

export async function insertBook(data: {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string | null;
  genre?: string | null;
  pageCount?: number | null;
  yearPublished?: number | null;
  googleBooksId?: string | null;
}) {
  await db.insert(book).values(data);
}
