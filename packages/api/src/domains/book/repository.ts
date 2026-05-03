import { asc, count, eq, ilike, or, sql, desc } from "drizzle-orm";
import { db, book, review, type GenreValue } from "@book-review-platform/db";

const bookWithRatingFields = {
  id: book.id,
  title: book.title,
  author: book.author,
  description: book.description,
  coverUrl: book.coverUrl,
  genre: book.genre,
  pageCount: book.pageCount,
  yearPublished: book.yearPublished,
  googleBooksId: book.googleBooksId,
  averageRating: sql<
    number | null
  >`round(cast(avg(${review.rating}) as numeric), 1)`, // apskaiciuoja vidutini knygos vertinima su vienu sk po kablelio
  reviewCount: count(review.id),
};

export async function getBookById(bookId: string) {
  const rows = await db
    .select(bookWithRatingFields)
    .from(book)
    .leftJoin(review, eq(book.id, review.bookId))
    .where(eq(book.id, bookId))
    .groupBy(book.id);

  return rows[0] ?? null;
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
    db
      .select(bookWithRatingFields)
      .from(book)
      .leftJoin(review, eq(book.id, review.bookId))
      .where(searchFilter)
      .groupBy(book.id)
      .orderBy(asc(book.title))
      .limit(limit)
      .offset(offset),
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

export async function getBookByTitleAndAuthor(title: string, author: string) {
  return db.query.book.findFirst({
    where: sql`lower(${book.title}) = lower(${title}) and lower(${book.author}) = lower(${author})`,
    columns: {
      id: true,
    },
  });
}

export async function getBooksByGenre(genre: GenreValue, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const genreFilter = eq(book.genre, genre);

  const [books, totalResult] = await Promise.all([
    db
      .select(bookWithRatingFields)
      .from(book)
      .leftJoin(review, eq(book.id, review.bookId))
      .where(genreFilter)
      .groupBy(book.id)
      .orderBy(asc(book.title))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(book).where(genreFilter),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return {
    books,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function insertBook(data: {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string | null;
  genre?: GenreValue | null;
  pageCount?: number | null;
  yearPublished?: number | null;
  googleBooksId?: string | null;
}) {
  await db.insert(book).values(data);
}

export async function getTopRatedBooks(limit = 10) {
  return db
    .select(bookWithRatingFields)
    .from(book)
    .leftJoin(review, eq(book.id, review.bookId))
    .groupBy(book.id)
    .having(sql`count(${review.id}) >= 2 and avg(${review.rating}) is not null`)
    .orderBy(desc(sql`round(cast(avg(${review.rating}) as numeric), 1)`))
    .limit(limit);
}

export async function getMostReviewedBooks(limit = 10) {
  return db
    .select(bookWithRatingFields)
    .from(book)
    .leftJoin(review, eq(book.id, review.bookId))
    .groupBy(book.id)
    .having(sql`count(${review.id}) >= 1`)
    .orderBy(desc(count(review.id)))
    .limit(limit);
}
