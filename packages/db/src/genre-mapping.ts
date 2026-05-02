export type GenreValue =
  | "FICTION"
  | "FANTASY"
  | "SCIENCE_FICTION"
  | "MYSTERY_THRILLER"
  | "ROMANCE"
  | "HORROR"
  | "HISTORICAL_FICTION"
  | "LITERARY_FICTION"
  | "YOUNG_ADULT"
  | "CHILDREN"
  | "BIOGRAPHY"
  | "SELF_HELP"
  | "SCIENCE"
  | "HISTORY"
  | "PHILOSOPHY"
  | "POETRY"
  | "COMICS_GRAPHIC_NOVELS"
  | "TRUE_CRIME"
  | "BUSINESS";

const GENRE_MAP: Record<string, GenreValue> = {
  fiction: "FICTION",
  "american fiction": "FICTION",
  "english fiction": "FICTION",
  drama: "FICTION",
  humor: "FICTION",
  "fantasy fiction": "FANTASY",
  "fantasy fiction, french": "FANTASY",
  "science fiction": "SCIENCE_FICTION",
  mystery: "MYSTERY_THRILLER",
  "detective and mystery stories": "MYSTERY_THRILLER",
  "detective and mystery stories, english.": "MYSTERY_THRILLER",
  "true crime": "TRUE_CRIME",
  romance: "ROMANCE",
  "romance fiction, american": "ROMANCE",
  horror: "HORROR",
  "historical fiction": "HISTORICAL_FICTION",
  "literary collections": "LITERARY_FICTION",
  "literary criticism": "LITERARY_FICTION",
  "young adult fiction": "YOUNG_ADULT",
  "juvenile fiction": "CHILDREN",
  "juvenile nonfiction": "CHILDREN",
  "children's stories, english": "CHILDREN",
  "biography & autobiography": "BIOGRAPHY",
  "self-help": "SELF_HELP",
  psychology: "SELF_HELP",
  "health & fitness": "SELF_HELP",
  "body, mind & spirit": "SELF_HELP",
  science: "SCIENCE",
  "technology & engineering": "SCIENCE",
  medical: "SCIENCE",
  history: "HISTORY",
  "political science": "HISTORY",
  "social science": "HISTORY",
  philosophy: "PHILOSOPHY",
  religion: "PHILOSOPHY",
  poetry: "POETRY",
  "french poetry": "POETRY",
  "comics & graphic novels": "COMICS_GRAPHIC_NOVELS",
  "comic books, strips, etc": "COMICS_GRAPHIC_NOVELS",
  "business & economics": "BUSINESS",
};

export function mapGoogleGenre(
  categories: string[] | undefined | null
): GenreValue | null {
  if (!categories || categories.length === 0) return null;

  const primary = categories[0]?.toLowerCase().trim();
  if (!primary) return null;

  const direct = GENRE_MAP[primary];
  if (direct) return direct;

  for (const [key, genre] of Object.entries(GENRE_MAP)) {
    if (primary.includes(key)) return genre;
  }

  return null;
}
