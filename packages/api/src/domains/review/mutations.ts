import crypto from "node:crypto";
import { protectedProcedure } from "../../core/trpc";
import * as repo from "./repository";
import {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
} from "./validation";

export const create = protectedProcedure
  .input(createReviewSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;

    const existing = await repo.getReviewByUserAndBook(userId, input.bookId);

    if (existing) {
      throw new Error("You already reviewed this book.");
    }

    const reviewId = crypto.randomUUID();

    await repo.insertReview({
      id: reviewId,
      userId,
      bookId: input.bookId,
      rating: input.rating,
      content: input.content ?? null,
    });

    return { reviewId };
  });

export const update = protectedProcedure
  .input(updateReviewSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;

    const existing = await repo.getReviewById(input.reviewId);

    if (!existing) {
      throw new Error("Review not found.");
    }

    if (existing.userId !== userId) {
      throw new Error("You can only edit your own reviews.");
    }

    await repo.updateReview(input.reviewId, {
      rating: input.rating,
      content: input.content ?? null,
    });

    return { reviewId: input.reviewId };
  });

export const remove = protectedProcedure
  .input(deleteReviewSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;

    const existing = await repo.getReviewById(input.reviewId);

    if (!existing) {
      throw new Error("Review not found.");
    }

    if (existing.userId !== userId) {
      throw new Error("You can only delete your own reviews.");
    }

    await repo.deleteReview(input.reviewId);

    return { reviewId: input.reviewId };
  });

export const reviewMutations = {
  create,
  update,
  remove,
};
