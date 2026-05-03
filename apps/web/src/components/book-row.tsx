"use client";

import { BookCard } from "./book-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@book-review-platform/ui/components/carousel";

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  averageRating?: number | null;
  reviewCount?: number;
};

type BookRowProps = {
  title?: string;
  books: Book[];
};

export function BookRow({ title, books }: BookRowProps) {
  if (books.length === 0) return null;

  return (
    <div>
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-[#4b3527]">{title}</h2>
      )}
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {books.map((book) => (
            <CarouselItem key={book.id} className="pl-4 basis-auto">
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                averageRating={book.averageRating}
                reviewCount={book.reviewCount}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
