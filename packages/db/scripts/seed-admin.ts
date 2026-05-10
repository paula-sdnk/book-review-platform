import { eq } from "drizzle-orm";
import { db, user } from "../src";

await db
  .update(user)
  .set({ role: "ADMIN" })
  .where(eq(user.email, "paula@gmail.com"));
