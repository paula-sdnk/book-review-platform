import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { requireAuth } from "../domains/auth/access";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  requireAuth(ctx);

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
