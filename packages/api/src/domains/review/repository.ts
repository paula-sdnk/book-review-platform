import { count, eq, and, desc, avg } from "drizzle-orm";
import { db, review } from "@book-review-platform/db";

export async function getReviewById(reviewId: string) {
  return db.query.review.findFirst({
    where: eq(review.id, reviewId),
    with: { user: true },
  });
}

export async function getReviewByUserAndBook(userId: string, bookId: string) {
  return db.query.review.findFirst({
    where: and(eq(review.userId, userId), eq(review.bookId, bookId)),
    columns: { id: true },
  });
}

export async function getReviewsByBookId(bookId: string, page = 1, limit = 20) {
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  const filter = eq(review.bookId, bookId);

  const [reviews, totalResult] = await Promise.all([
    db.query.review.findMany({
      where: filter,
      orderBy: [desc(review.createdAt)],
      limit,
      offset,
      with: { user: true },
    }),
    db.select({ total: count() }).from(review).where(filter),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    reviews,
    total,
    totalPages,
    currentPage,
  };
}

export async function getReviewsByUserId(userId: string, page = 1, limit = 10) {
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;
  const filter = eq(review.userId, userId);

  const [reviews, totalResult, averageResult] = await Promise.all([
    db.query.review.findMany({
      where: filter,
      orderBy: [desc(review.createdAt)],
      limit,
      offset,
      with: {
        book: true,
      },
    }),
    db.select({ total: count() }).from(review).where(filter),
    db
      .select({ averageRating: avg(review.rating) })
      .from(review)
      .where(filter),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const averageRatingValue = averageResult[0]?.averageRating;

  return {
    reviews,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage,
    averageRating:
      averageRatingValue === null ? null : Number(averageRatingValue),
  };
}

export async function insertReview(data: {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  content?: string | null;
}) {
  await db.insert(review).values(data);
}

export async function updateReview(
  reviewId: string,
  data: {
    rating?: number;
    content?: string | null;
  }
) {
  await db.update(review).set(data).where(eq(review.id, reviewId));
}

export async function deleteReview(reviewId: string) {
  await db.delete(review).where(eq(review.id, reviewId));
}
