import { z } from "zod";

const currentYear = new Date().getFullYear();

export const createBookSchema = z.object({
  title: z.string().min(1).max(180),
  author: z.string().min(1).max(150),
  description: z.string().min(30).max(5000),
  coverUrl: z.string().optional(),
  genre: z.string().optional(),
  pageCount: z.number().int().min(1).optional().nullable(),
  yearPublished: z
    .number()
    .int()
    .max(currentYear + 1)
    .optional()
    .nullable(),
});
