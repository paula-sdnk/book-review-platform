import { TRPCError } from "@trpc/server";
import type { Context } from "../../core/context";

export function requireAuth(ctx: Context) {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
}
