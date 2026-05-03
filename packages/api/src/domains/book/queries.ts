import { z } from "zod";
import { publicProcedure } from "../../core/trpc";
import * as repo from "./repository";
import type { GenreValue } from "@book-review-platform/db";

export const getById = publicProcedure
  .input(z.object({ bookId: z.string() }))
  .query(async ({ input }) => {
    return repo.getBookById(input.bookId);
  });

export const search = publicProcedure
  .input(
    z.object({
      query: z.string(),
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(100).optional().default(20),
    })
  )
  .query(async ({ input }) => {
    return repo.searchBooks(input.query, input.page, input.limit);
  });

export const getTopRated = publicProcedure.query(async () => {
  return repo.getTopRatedBooks();
});

export const getMostReviewed = publicProcedure.query(async () => {
  return repo.getMostReviewedBooks();
});

export const getTrendingBooks = publicProcedure.query(async () => {
  return repo.getTrendingBooks();
});

export const getByGenre = publicProcedure
  .input(
    z.object({
      genre: z.string(),
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(100).optional().default(20),
    })
  )
  .query(async ({ input }) => {
    return repo.getBooksByGenre(
      input.genre as GenreValue,
      input.page,
      input.limit
    );
  });

export const bookQueries = {
  getById,
  search,
  getTopRated,
  getMostReviewed,
  getTrendingBooks,
  getByGenre,
};
