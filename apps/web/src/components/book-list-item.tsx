import type { Route } from "next";
import Link from "next/link";
import { RatingBadge } from "./rating-badge";

type BookListItemProps = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  averageRating?: number | null;
  reviewCount?: number;
};

export function BookListItem({
  id,
  title,
  author,
  coverUrl,
  averageRating,
  reviewCount = 0,
}: BookListItemProps) {
  const bookHref = `/books/${id}` as Route;

  return (
    <Link
      href={bookHref}
      className="block w-full min-w-0 rounded-xl border border-[#e7d8bf] bg-[#fffaf2] p-4 shadow-sm transition hover:bg-[#fcf4e8]"
    >
      <div className="flex min-w-0 gap-4">
        <div className="h-24 w-16 shrink-0 overflow-hidden rounded-md border border-[#e7d8bf] bg-[#fffdf8]">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[#a48b78]">
              No cover
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold text-[#4b3527] break-words">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#6b5646]">{author}</p>
          {averageRating !== undefined && (
            <div className="mt-1">
              <RatingBadge
                averageRating={averageRating}
                reviewCount={reviewCount}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
