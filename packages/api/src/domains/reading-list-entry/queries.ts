import { z } from "zod";
import { protectedProcedure } from "../../core/trpc";
import * as repo from "./repository";

export const getEntry = protectedProcedure
  .input(z.object({ bookId: z.string().min(1) }))
  .query(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;
    return repo.getReadingListEntry(userId, input.bookId);
  });

export const getMyReadingList = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session!.user.id;
  return repo.getUserReadingList(userId);
});

export const readingListQueries = {
  getEntry,
  getMyReadingList,
};
