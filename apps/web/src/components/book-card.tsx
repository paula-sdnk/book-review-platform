import type { Route } from "next";
import Link from "next/link";
import { RatingBadge } from "./rating-badge";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  averageRating?: number | null;
  reviewCount?: number;
};

export function BookCard({
  id,
  title,
  author,
  coverUrl,
  averageRating,
  reviewCount = 0,
}: BookCardProps) {
  const bookHref = `/books/${id}` as Route;

  return (
    <Link
      href={bookHref}
      className="group flex w-[140px] shrink-0 flex-col gap-2"
    >
      <div className="h-[210px] w-[140px] overflow-hidden rounded-xl border border-[#e7d8bf] bg-[#fffdf8] shadow-sm transition group-hover:shadow-md">
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

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#4b3527]">{title}</p>
        <p className="truncate text-xs text-[#6b5646]">{author}</p>
        {averageRating !== undefined && (
          <div className="mt-1">
            <RatingBadge
              averageRating={averageRating}
              reviewCount={reviewCount}
              size="sm"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
