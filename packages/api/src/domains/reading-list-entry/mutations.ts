import { z } from "zod";
import { protectedProcedure } from "../../core/trpc";
import * as repo from "./repository";
import { upsertReadingListSchema } from "./validation";

export const upsert = protectedProcedure
  .input(upsertReadingListSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;
    await repo.upsertReadingListEntry(userId, input.bookId, input.status);
  });

export const remove = protectedProcedure
  .input(z.object({ bookId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session!.user.id;

    const existing = await repo.getReadingListEntry(userId, input.bookId);
    if (!existing) {
      throw new Error("Reading list entry not found.");
    }

    await repo.deleteReadingListEntry(userId, input.bookId);
  });

export const readingListMutations = {
  upsert,
  remove,
};
