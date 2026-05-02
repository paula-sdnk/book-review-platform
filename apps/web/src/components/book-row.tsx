"use client";

import { useRef, useState, useEffect } from "react";
import { BookCard } from "./book-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  averageRating?: number | null;
  reviewCount?: number;
};

type BookRowProps = {
  title: string;
  books: Book[];
};

export function BookRow({ title, books }: BookRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  if (books.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-[#4b3527]">{title}</h2>
      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#e7d8bf] bg-[#fffaf2] p-2 shadow-md transition hover:bg-[#f3e7d3]"
          >
            <ChevronLeft className="h-5 w-5 text-[#4b3527]" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              averageRating={book.averageRating}
              reviewCount={book.reviewCount}
            />
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#e7d8bf] bg-[#fffaf2] p-2 shadow-md transition hover:bg-[#f3e7d3]"
          >
            <ChevronRight className="h-5 w-5 text-[#4b3527]" />
          </button>
        )}
      </div>
    </section>
  );
}
