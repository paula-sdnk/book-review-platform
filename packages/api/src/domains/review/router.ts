import { router } from "../../core/trpc";
import { reviewQueries } from "./queries";
import { reviewMutations } from "./mutations";

export const reviewRouter = router({
  ...reviewQueries,
  ...reviewMutations,
});
