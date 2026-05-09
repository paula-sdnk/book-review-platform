import { z } from "zod";

const currentYear = new Date().getFullYear();

const genreValues = [
  "FICTION",
  "FANTASY",
  "SCIENCE_FICTION",
  "MYSTERY_THRILLER",
  "ROMANCE",
  "HORROR",
  "HISTORICAL_FICTION",
  "LITERARY_FICTION",
  "YOUNG_ADULT",
  "CHILDREN",
  "BIOGRAPHY",
  "SELF_HELP",
  "SCIENCE",
  "HISTORY",
  "PHILOSOPHY",
  "POETRY",
  "COMICS_GRAPHIC_NOVELS",
  "TRUE_CRIME",
  "BUSINESS",
] as const;

export type GenreValue = (typeof genreValues)[number];

export const createBookSchema = z.object({
  title: z.string().min(1).max(180),
  author: z.string().min(1).max(150),
  description: z.string().min(30).max(5000),
  coverUrl: z.string().optional(),
  genre: z.enum(genreValues).optional().nullable(),
  pageCount: z.number().int().min(1).optional().nullable(),
  yearPublished: z
    .number()
    .int()
    .max(currentYear + 1)
    .optional()
    .nullable(),
});
