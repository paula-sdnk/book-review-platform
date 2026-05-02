export const GENRE_OPTIONS = [
  { value: "FICTION", label: "Fiction" },
  { value: "FANTASY", label: "Fantasy" },
  { value: "SCIENCE_FICTION", label: "Science Fiction" },
  { value: "MYSTERY_THRILLER", label: "Mystery & Thriller" },
  { value: "ROMANCE", label: "Romance" },
  { value: "HORROR", label: "Horror" },
  { value: "HISTORICAL_FICTION", label: "Historical Fiction" },
  { value: "LITERARY_FICTION", label: "Literary Fiction" },
  { value: "YOUNG_ADULT", label: "Young Adult" },
  { value: "CHILDREN", label: "Children" },
  { value: "BIOGRAPHY", label: "Biography" },
  { value: "SELF_HELP", label: "Self-Help" },
  { value: "SCIENCE", label: "Science" },
  { value: "HISTORY", label: "History" },
  { value: "PHILOSOPHY", label: "Philosophy" },
  { value: "POETRY", label: "Poetry" },
  { value: "COMICS_GRAPHIC_NOVELS", label: "Comics & Graphic Novels" },
  { value: "TRUE_CRIME", label: "True Crime" },
  { value: "BUSINESS", label: "Business" },
] as const;

export type GenreValue = (typeof GENRE_OPTIONS)[number]["value"];

export function getGenreLabel(value: string): string {
  return GENRE_OPTIONS.find((g) => g.value === value)?.label ?? value;
}
