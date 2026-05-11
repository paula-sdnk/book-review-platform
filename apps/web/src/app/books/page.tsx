import type { Route } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@book-review-platform/auth";
import { BookListItem } from "@/components/book-list-item";
import { api } from "@/lib/trpc-server";
import { GENRE_OPTIONS } from "@/lib/genres";
import { Search } from "lucide-react";
import { GenreDrawer } from "@/components/genre-drawer";

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
    <main className="min-h-screen bg-[#f6efe3] px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#4b3527]">
              Search books
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#6b5646]">
              Search by title or author.
            </p>
          </div>

          {/* Mobile: genre filter burger | Desktop: hidden (sidebar handles it) */}
          <div className="mt-1 sm:hidden">
            <GenreDrawer genres={GENRE_OPTIONS} activeGenre={genre} />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex gap-12">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {session?.user && (
              <div>
                <Link
                  href="/books/new"
                  className="inline-flex items-center rounded-2xl border border-[#dcc9ac] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4b3527] transition hover:bg-[#f3e7d3]"
                >
                  Add new book
                </Link>
              </div>
            )}

            {/* Search bar — now inside main column */}
            <form action="/books" method="GET" className="mt-4 flex gap-2">
              <input
                name="query"
                type="text"
                defaultValue={query}
                placeholder="Search books..."
                className="h-9 sm:h-10 min-w-0 flex-1 rounded-lg border border-[#dcc9ac] bg-[#fffdf8] px-3 sm:px-4 text-sm text-[#4b3527] placeholder:text-[#a48b78] outline-none focus:border-[#c49a63]"
              />
              <button
                type="submit"
                className="h-9 sm:h-10 shrink-0 cursor-pointer rounded-xl bg-[#c49a63] px-3 sm:px-5 text-white transition hover:bg-[#b48953] flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline text-sm font-medium">
                  Search
                </span>
              </button>
            </form>

            {/* Results */}
            <div className="mt-6">
              {!query && !genre ? (
                <p className="text-sm text-[#6b5646]">
                  Enter a title or author to search, or browse by genre.
                </p>
              ) : books.length === 0 ? (
                <p className="text-sm text-[#6b5646]">
                  {query
                    ? `No books found for "${query}".`
                    : `No books found in ${activeGenre?.label}.`}
                </p>
              ) : (
                <>
                  <p className="text-sm text-[#6b5646]">{resultHeading}</p>

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
                    <div className="mt-8 flex items-center justify-between gap-2">
                      {currentPage > 1 ? (
                        <Link
                          href={
                            query
                              ? buildSearchHref(query, currentPage - 1)
                              : buildGenreHref(genre, currentPage - 1)
                          }
                          className="rounded-lg border border-[#dcc9ac] bg-white px-3 py-1.5 text-sm text-[#4b3527] whitespace-nowrap"
                        >
                          ← Prev
                        </Link>
                      ) : (
                        <div />
                      )}

                      <p className="text-sm text-[#6b5646] text-center">
                        {currentPage} / {totalPages}
                      </p>

                      {currentPage < totalPages ? (
                        <Link
                          href={
                            query
                              ? buildSearchHref(query, currentPage + 1)
                              : buildGenreHref(genre, currentPage + 1)
                          }
                          className="rounded-lg border border-[#dcc9ac] bg-white px-3 py-1.5 text-sm text-[#4b3527] whitespace-nowrap"
                        >
                          Next →
                        </Link>
                      ) : (
                        <div />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop genre sidebar */}
          <aside className="hidden sm:block w-44 shrink-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b48953]">
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
      </div>
    </main>
  );
}
