import { router } from "../core/trpc";
import { bookRouter } from "../domains/book/router";
import { reviewRouter } from "../domains/review/router";

export const appRouter = router({
  book: bookRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
