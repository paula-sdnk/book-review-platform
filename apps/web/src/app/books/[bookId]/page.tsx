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
    notFound(); // show a 404 page to the user
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-8 shadow-sm">
          <div className="flex gap-10">
            <div className="h-[420px] w-[280px] shrink-0 overflow-hidden rounded-xl border border-[#e7d8bf] bg-[#fffdf8]">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#a48b78]">
                  No cover
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
                Book details
              </p>

              <h1 className="mt-4 text-4xl font-bold text-[#4b3527]">
                {book.title}
              </h1>

              <p className="mt-3 text-xl text-[#6b5646]">{book.author}</p>

              <div className="mt-8 space-y-3 text-sm text-[#4b3527]">
                {book.genre ? (
                  <p>
                    <span className="font-semibold">Genre:</span> {book.genre}
                  </p>
                ) : null}

                {book.pageCount ? (
                  <p>
                    <span className="font-semibold">Pages:</span>{" "}
                    {book.pageCount}
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
        </div>

        <section className="mt-8 rounded-3xl border border-[#e7d8bf] bg-[#fffaf2] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#4b3527]">Description</h2>
          <div className="mt-4 text-[#6b5646]">
            <BookDescription description={book.description} />
          </div>
        </section>
      </div>
    </main>
  );
}
