import { searchBooks } from "@book-review-platform/db";
import { BookListItem } from "@/components/book-list-item";

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
    <main className="min-h-screen bg-[#f6efe3] px-6 py-16">
      <div className="mx-auto w-full max-w-[760px]">
        <h1 className="text-3xl font-semibold text-[#4b3527]">Search books</h1>
        <p className="mt-2 text-[#6b5646]">Search by title or author.</p>

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
            className="cursor-pointer h-10 rounded-lg bg-[#c49a63] px-6 font-medium text-white transition hover:bg-[#b48953]"
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
          <div className="mt-6 flex flex-col gap-4">
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
        )}
      </div>
    </main>
  );
}
