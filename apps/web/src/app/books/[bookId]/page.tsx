import { getBookById } from "@book-review-platform/db";
import { notFound } from "next/navigation";
import { BookDescription } from "@/components/book-description";

type BookDetailsPageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { bookId } = await params;
  const book = await getBookById(bookId);

  if (!book) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex gap-12">
        <div className="h-74 w-54 shrink-0 overflow-hidden rounded-md border bg-muted">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No cover
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{book.author}</p>

          <div className="mt-6 space-y-2 text-sm">
            {book.genre ? (
              <p>
                <span className="font-semibold">Genre:</span> {book.genre}
              </p>
            ) : null}

            {book.pageCount ? (
              <p>
                <span className="font-semibold">Pages:</span> {book.pageCount}
              </p>
            ) : null}

            {book.yearPublished ? (
              <p>
                <span className="font-semibold">Year published:</span>{" "}
                {book.yearPublished}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Description</h2>
        <BookDescription description={book.description} />
      </section>
    </main>
  );
}
