import Link from "next/link";
import { BookListItem } from "@/components/book-list-item";
import { api } from "@/lib/trpc-server";

type BooksPageProps = {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
};

function buildBooksPageHref(query: string, page: number) {
  return {
    pathname: "/books",
    query: {
      query,
      page: String(page),
    },
  };
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query ?? "";
  const parsedPage = Number(resolvedSearchParams?.page ?? "1");

  const currentPage =
    Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const t = await api();
  const searchResult = query
    ? await t.book.search({ query, page: currentPage, limit: 20 })
    : {
        books: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      };

  const { books, total, totalPages } = searchResult;

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-16">
      <div className="mx-auto w-full max-w-[760px]">
        <h1 className="text-3xl font-semibold text-[#4b3527]">Search books</h1>

        <p className="mt-2 text-[#6b5646]">Search by title or author.</p>

        <div className="mt-5">
          <Link
            href="/books/new"
            className="inline-flex items-center rounded-full border border-[#dcc9ac] bg-white px-4 py-2 text-sm font-medium text-[#4b3527] transition hover:bg-[#f3e7d3]"
          >
            Add new book
          </Link>
        </div>

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
            className="h-10 cursor-pointer rounded-lg bg-[#c49a63] px-6 font-medium text-white transition hover:bg-[#b48953]"
          >
            Search
          </button>
        </form>

        {!query ? (
          <p className="mt-6 text-[#6b5646]">
            Enter a title or author to search.
          </p>
        ) : books.length === 0 ? (
          <p className="mt-6 text-[#6b5646]">No books found for "{query}".</p>
        ) : (
          <>
            <p className="mt-6 text-sm text-[#6b5646]">
              {total} result{total === 1 ? "" : "s"} found.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              {books.map((currentBook) => (
                <BookListItem
                  key={currentBook.id}
                  id={currentBook.id}
                  title={currentBook.title}
                  author={currentBook.author}
                  coverUrl={currentBook.coverUrl}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-8 flex items-center justify-between">
                {currentPage > 1 ? (
                  <Link
                    href={buildBooksPageHref(query, currentPage - 1)}
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
                    href={buildBooksPageHref(query, currentPage + 1)}
                    className="rounded-lg border border-[#dcc9ac] bg-white px-4 py-2 text-[#4b3527]"
                  >
                    Next
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
