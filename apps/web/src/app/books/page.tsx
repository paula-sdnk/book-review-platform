import { searchBooks } from "@book-review-platform/db";
import Link from "next/link";
import type { Route } from "next";

type BooksPageProps = {
  searchParams?: Promise<{
    query?: string;
  }>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query ?? "";
  const books = query ? await searchBooks(query) : [];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Search books</h1>
      <p className="mt-2 text-muted-foreground">Search by title or author.</p>

      <form action="/books" method="GET" className="mt-6 flex gap-3">
        <input
          name="query"
          type="text"
          defaultValue={query}
          placeholder="Search books..."
          className="w-full rounded-md border px-4 py-2"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md border px-4 py-2"
        >
          Search
        </button>
      </form>

      {!query ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Enter a title or author to search.
        </p>
      ) : books.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No books found for "{query}".
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {books.map((currentBook) => {
            const bookHref = `/books/${currentBook.id}` as Route;

            return (
              <li key={currentBook.id}>
                <Link href={bookHref} className="hover:underline">
                  {currentBook.title} — {currentBook.author}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
