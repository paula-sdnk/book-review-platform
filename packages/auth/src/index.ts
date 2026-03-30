import { db } from "@book-review-platform/db";
import * as schema from "@book-review-platform/db/schema/auth";
import { env } from "@book-review-platform/env/server";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

const authOptions: BetterAuthOptions = {
  database: drizzleAdapter(db, {
    // Drizzle database client
    provider: "pg", // PostgreSQL
    schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN], // only trust auth requests from this frontend origin
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET, // proves that session data came from my app
  baseURL: env.BETTER_AUTH_URL, // this is the main URL for auth endpoints and callbacks
  plugins: [nextCookies()], // use Next.js cookies to store and read sessions
};

type Auth = ReturnType<typeof betterAuth>;

export const auth: Auth = betterAuth(authOptions);
