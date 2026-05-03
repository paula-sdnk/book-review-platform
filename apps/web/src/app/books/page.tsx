import type { Route } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@book-review-platform/auth";
import { BookListItem } from "@/components/book-list-item";
import { api } from "@/lib/trpc-server";

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

type BooksPageProps = {
  searchParams?: Promise<{
    query?: string;
    genre?: string;
    page?: string;
  }>;
};

function buildSearchHref(query: string, page: number) {
  return `/books?query=${encodeURIComponent(query)}&page=${page}` as Route;
}

function buildGenreHref(genre: string, page: number) {
  return `/books?genre=${genre}&page=${page}` as Route;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query ?? "";
  const genre = resolvedParams?.genre ?? "";
  const parsedPage = Number(resolvedParams?.page ?? "1");
  const currentPage =
    Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const [caller, session] = await Promise.all([
    api(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const activeGenre = GENRE_OPTIONS.find((g) => g.value === genre);

  const result = query
    ? await caller.book.search({ query, page: currentPage, limit: 20 })
    : genre && activeGenre
    ? await caller.book.getByGenre({ genre, page: currentPage, limit: 20 })
    : { books: [], total: 0, totalPages: 0, currentPage: 1 };

  const { books, total, totalPages } = result;

  const resultHeading = query
    ? `${total} result${total === 1 ? "" : "s"} for "${query}"`
    : activeGenre
    ? `${total} book${total === 1 ? "" : "s"} in ${activeGenre.label}`
    : null;

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl gap-20">
        {/* Left — main content */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-[#4b3527]">
            Search books
          </h1>
          <p className="mt-2 text-[#6b5646]">Search by title or author.</p>

          {session?.user && (
            <div className="mt-5">
              <Link
                href="/books/new"
                className="inline-flex items-center rounded-2xl border border-[#dcc9ac] bg-white px-4 py-2 text-sm font-medium text-[#4b3527] transition hover:bg-[#f3e7d3]"
              >
                Add new book
              </Link>
            </div>
          )}

          <form action="/books" method="GET" className="mt-6 flex gap-3">
            <input
              name="query"
              type="text"
              defaultValue={query}
              placeholder="Search books..."
              className="h-10 w-full rounded-lg border border-[#dcc9ac] bg-[#fffdf8] px-4 text-[#4b3527] placeholder:text-[#a48b78] outline-none focus:border-[#c49a63]"
            />
            <button
              type="submit"
              className="h-10 cursor-pointer rounded-2xl bg-[#c49a63] px-6 font-medium text-white transition hover:bg-[#b48953]"
            >
              Search
            </button>
          </form>

          {!query && !genre ? (
            <p className="mt-6 text-[#6b5646]">
              Enter a title or author to search, or browse by genre.
            </p>
          ) : books.length === 0 ? (
            <p className="mt-6 text-[#6b5646]">
              {query
                ? `No books found for "${query}".`
                : `No books found in ${activeGenre?.label}.`}
            </p>
          ) : (
            <>
              <p className="mt-6 text-sm text-[#6b5646]">{resultHeading}</p>

              <div className="mt-4 flex flex-col gap-4">
                {books.map((currentBook) => (
                  <BookListItem
                    key={currentBook.id}
                    id={currentBook.id}
                    title={currentBook.title}
                    author={currentBook.author}
                    coverUrl={currentBook.coverUrl}
                    averageRating={currentBook.averageRating}
                    reviewCount={currentBook.reviewCount}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  {currentPage > 1 ? (
                    <Link
                      href={
                        query
                          ? buildSearchHref(query, currentPage - 1)
                          : buildGenreHref(genre, currentPage - 1)
                      }
                      className="rounded-lg border border-[#dcc9ac] bg-white px-4 py-2 text-[#4b3527]"
                    >
                      Previous
                    </Link>
                  ) : (
                    <div />
                  )}

                  <p className="text-sm text-[#6b5646]">
                    Page {currentPage} of {totalPages}
                  </p>

                  {currentPage < totalPages ? (
                    <Link
                      href={
                        query
                          ? buildSearchHref(query, currentPage + 1)
                          : buildGenreHref(genre, currentPage + 1)
                      }
                      className="rounded-lg border border-[#dcc9ac] bg-white px-4 py-2 text-[#4b3527]"
                    >
                      Next
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right — genre sidebar */}
        <aside className="w-48 shrink-0">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
            Browse by genre
          </p>

          <div className="mt-4 flex flex-col gap-1">
            {GENRE_OPTIONS.map((g) => (
              <Link
                key={g.value}
                href={`/books?genre=${g.value}` as Route}
                className={`rounded-lg px-3 py-1 text-sm transition ${
                  genre === g.value
                    ? "bg-[#b48953] font-medium text-white"
                    : "text-[#4b3527] hover:bg-[#f3e7d3]"
                }`}
              >
                {g.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
