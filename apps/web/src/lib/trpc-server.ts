import "server-only";
import { headers } from "next/headers";
import {
  appRouter,
  createCallerFactory,
  createContext,
} from "@book-review-platform/api";

const createCaller = createCallerFactory(appRouter);

export async function api() {
  const heads = new Headers(await headers());
  const ctx = await createContext({ headers: heads });
  return createCaller(ctx);
}
