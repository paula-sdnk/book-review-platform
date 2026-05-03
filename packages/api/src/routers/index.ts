import { router } from "../core/trpc";
import { bookRouter } from "../domains/book/router";
import { readingListRouter } from "../domains/reading-list-entry/router";
import { reviewRouter } from "../domains/review/router";

export const appRouter = router({
  book: bookRouter,
  review: reviewRouter,
  readingListEntry: readingListRouter,
});

export type AppRouter = typeof appRouter;
