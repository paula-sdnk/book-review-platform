import type { Route } from "next";
import Link from "next/link";

type BookListItemProps = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
};

export function BookListItem({
  id,
  title,
  author,
  coverUrl,
}: BookListItemProps) {
  const bookHref = `/books/${id}` as Route;

  return (
    <Link
      href={bookHref}
      className="flex w-[700px] gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
    >
      <div className="h-24 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No cover
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{author}</p>
      </div>
    </Link>
  );
}
