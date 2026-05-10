import Link from "next/link";
import { RatingBadge } from "@/components/rating-badge";

type DashboardReviewCardProps = {
  review: {
    id: string;
    bookId: string;
    rating: number;
    content: string | null;
    createdAt: Date;
    book: {
      title: string;
      author: string;
      coverUrl: string | null;
    };
  };
};

const dateFormatter = new Intl.DateTimeFormat("en-EN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function DashboardReviewCard({ review }: DashboardReviewCardProps) {
  return (
    <Link
      href={`/books/${review.bookId}`}
      className="overflow-hidden block rounded-xl border border-[#e6d5bd] bg-[#fffaf2] px-4 py-3 transition hover:border-[#d4b08a] hover:shadow-sm sm:grid sm:grid-cols-[64px_2fr_1fr_2fr_1fr] sm:items-center sm:gap-4"
    >
      <div className="flex gap-3 sm:contents">
        <div className="h-20 w-14 sm:w-16 shrink-0 overflow-hidden rounded-md bg-[#eadfce]">
          {review.book.coverUrl ? (
            <img
              src={review.book.coverUrl}
              alt={review.book.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 sm:contents">
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#4b3527]">
              {review.book.title}
            </p>
            <p className="mt-0.5 truncate text-sm text-[#6b4f3a]">
              {review.book.author}
            </p>
          </div>

          <div className="mt-1 sm:mt-0">
            <RatingBadge
              averageRating={review.rating}
              reviewCount={1}
              showReviewCount={false}
            />
          </div>

          {/* Review + date: desktop grid cells */}
          <div className="hidden sm:block">
            {review.content ? (
              <p className="line-clamp-2 text-sm text-[#4b3527]">
                {review.content}
              </p>
            ) : (
              <p className="text-sm italic text-[#8a7763]">Rating only</p>
            )}
          </div>

          <div className="hidden sm:block">
            <p className="text-xs text-[#8a7763]">
              {dateFormatter.format(review.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:hidden">
        {review.content ? (
          <p className="line-clamp-2 text-sm text-[#4b3527]">
            {review.content}
          </p>
        ) : (
          <p className="text-sm italic text-[#8a7763]">Rating only</p>
        )}
        <p className="mt-1 text-xs text-[#8a7763]">
          {dateFormatter.format(review.createdAt)}
        </p>
      </div>
    </Link>
  );
}
