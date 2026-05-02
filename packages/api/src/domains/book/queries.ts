import { z } from "zod";
import { publicProcedure } from "../../core/trpc";
import * as repo from "./repository";

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

export const bookQueries = {
  getById,
  search,
  getTopRated,
  getMostReviewed,
};
