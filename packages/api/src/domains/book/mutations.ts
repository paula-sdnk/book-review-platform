import crypto from "node:crypto";
import { protectedProcedure } from "../../core/trpc";
import * as repo from "./repository";
import { createBookSchema } from "./validation";

export const create = protectedProcedure
  .input(createBookSchema)
  .mutation(async ({ input }) => {
    const existing = await repo.getBookByTitleAndAuthor(
      input.title,
      input.author
    );

    if (existing) {
      throw new Error("Book already exists.");
    }

    const bookId = crypto.randomUUID();

    await repo.insertBook({
      id: bookId,
      title: input.title.trim(),
      author: input.author.trim(),
      description: input.description.trim(),
      coverUrl: input.coverUrl?.trim() ?? null,
      genre: input.genre?.trim() ?? null,
      pageCount: input.pageCount ?? null,
      yearPublished: input.yearPublished ?? null,
    });

    return {
      bookId,
    };
  });

export const bookMutations = {
  create,
};
