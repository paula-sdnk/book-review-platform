import { z } from "zod";

export const upsertReadingListSchema = z.object({
  bookId: z.string().min(1),
  status: z.enum(["WANT_TO_READ", "CURRENTLY_READING", "READ"]),
});
