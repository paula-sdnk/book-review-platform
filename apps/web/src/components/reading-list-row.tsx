import type { Route } from "next";
import Link from "next/link";
import { BookRow } from "./book-row";
import type { ReadingStatus } from "@/app/dashboard/reading-list/page";

const PREVIEW_LIMIT = 6;

type Entry = {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    reviews: { rating: number }[];
  };
};

type Props = {
  label: string;
  status: ReadingStatus;
  entries: Entry[];
  total: number;
};

export function ReadingListRow({ label, status, entries, total }: Props) {
  if (entries.length === 0) return null;

  const hasMore = total > PREVIEW_LIMIT;

  const books = entries.map(({ book }) => {
    const ratings = book.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10
          ) / 10
        : null;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      averageRating,
      reviewCount: ratings.length,
    };
  });

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#4b3527]">
          {label}
          <span className="ml-2 text-sm font-normal text-[#a48b78]">
            ({total})
          </span>
        </h2>

        {hasMore && (
          <Link
            href={`/dashboard/reading-list?status=${status}` as Route}
            className="text-sm text-[#b48953] underline underline-offset-4 transition hover:text-[#4b3527]"
          >
            See all
          </Link>
        )}
      </div>

      <BookRow title="" books={books} />
    </section>
  );
}
