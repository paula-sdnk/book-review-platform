import { router } from "../../core/trpc";
import { bookQueries } from "./queries";
import { bookMutations } from "./mutations";

export const bookRouter = router({
  ...bookQueries,
  ...bookMutations,
});
