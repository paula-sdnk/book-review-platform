import { z } from "zod";

export const createReviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10).max(3000).optional(),
});

export const updateReviewSchema = z.object({
  reviewId: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  content: z.string().min(10).max(3000).optional(),
});

export const deleteReviewSchema = z.object({
  reviewId: z.string().min(1),
});
