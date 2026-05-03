import { router } from "../../core/trpc";
import { readingListQueries } from "./queries";
import { readingListMutations } from "./mutations";

export const readingListRouter = router({
  ...readingListQueries,
  ...readingListMutations,
});
