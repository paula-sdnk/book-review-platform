import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../../core/trpc";
import * as repo from "./repository";

export const getById = publicProcedure
  .input(z.object({ reviewId: z.string() }))
  .query(async ({ input }) => {
    return repo.getReviewById(input.reviewId);
  });

export const getByBookId = publicProcedure
  .input(
    z.object({
      bookId: z.string(),
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(100).optional().default(20),
    })
  )
  .query(async ({ input }) => {
    return repo.getReviewsByBookId(input.bookId, input.page, input.limit);
  });

export const getByUserId = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(20).optional().default(3),
      page: z.number().min(1).optional().default(1),
    })
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session!.user.id;
    return repo.getReviewsByUserId(userId, input.page, input.limit);
  });

export const reviewQueries = {
  getById,
  getByBookId,
  getByUserId,
};
