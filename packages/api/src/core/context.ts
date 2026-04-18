import { auth } from "@book-review-platform/auth";

export async function createContext(opts: { headers: Headers }) {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
