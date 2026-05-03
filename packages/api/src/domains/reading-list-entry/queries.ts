import { z } from "zod";
import { protectedProcedure } from "../../core/trpc";
import * as repo from "./repository";

export const getEntry = protectedProcedure
  .input(z.object({ bookId: z.string().min(1) }))
  .query(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;
    return repo.getReadingListEntry(userId, input.bookId);
  });

export const getMyReadingListByStatus = protectedProcedure
  .input(
    z.object({
      status: z.enum(["WANT_TO_READ", "CURRENTLY_READING", "READ"]),
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(100).optional().default(20),
    })
  )
  .query(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;
    return repo.getUserReadingListByStatus(
      userId,
      input.status,
      input.page,
      input.limit
    );
  });

export const readingListQueries = {
  getEntry,
  getMyReadingListByStatus,
};
