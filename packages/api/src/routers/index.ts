import { router } from "../core/trpc";
import { bookRouter } from "../domains/book/router";

export const appRouter = router({
  book: bookRouter,
});

export type AppRouter = typeof appRouter;
