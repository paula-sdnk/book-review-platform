// import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import crypto from "node:crypto";
import { db } from "../src";
import { book } from "../src/schema/book";

// dotenv.config({
//   path: "../../../apps/web/.env",
// });

// The shape of the response from Google Books API
type GoogleBooksResponse = {
  items?: GoogleBook[];
};

// The raw Google book object
type GoogleBook = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    categories?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

// The cleaned book data that will be saved into the database
type MappedBook = {
  googleBooksId: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string | null;
  pageCount: number | null;
  genre: string | null;
  yearPublished: number | null;
};

// Read all author names from the txt file
async function getAuthorsFromFile(filePath: string): Promise<string[]> {
  const fileContent = await readFile(filePath, "utf-8");

  return fileContent
    .split("\n")
    .map((author) => author.trim())
    .filter((author) => author.length > 0);
}

// Small delay between requests so there won't be too many requests error
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function extractYear(publishedDate?: string): number | null {
  if (!publishedDate) {
    return null;
  }

  const year = Number.parseInt(publishedDate.slice(0, 4), 10);

  if (Number.isNaN(year)) {
    return null;
  }

  return year;
}

function normalizeCoverUrl(url?: string): string | null {
  if (!url) {
    return null;
  }

  return url.replace("http://", "https://");
}

// Keep only books where one author exactly matches the author that was searched for
function hasExactAuthorMatch(
  googleBook: GoogleBook,
  expectedAuthor: string
): boolean {
  const authors = googleBook.volumeInfo?.authors;

  if (!authors || authors.length === 0) {
    return false;
  }

  const normalizedExpectedAuthor = expectedAuthor.trim().toLowerCase();

  return authors.some(
    (author) => author.trim().toLowerCase() === normalizedExpectedAuthor
  );
}

// Convert one raw Google book into the shape for the database
// If title, author, or description is missing, skip the book
function mapGoogleBook(googleBook: GoogleBook): MappedBook | null {
  const volumeInfo = googleBook.volumeInfo;

  if (!volumeInfo?.title?.trim()) {
    return null;
  }

  if (!volumeInfo.authors || volumeInfo.authors.length === 0) {
    return null;
  }

  if (!volumeInfo.description?.trim()) {
    return null;
  }

  return {
    googleBooksId: googleBook.id,
    title: volumeInfo.title.trim(),
    author: volumeInfo.authors.join(", "),
    description: volumeInfo.description.trim(),
    coverUrl: normalizeCoverUrl(
      volumeInfo.imageLinks?.thumbnail ?? volumeInfo.imageLinks?.smallThumbnail
    ),
    pageCount: volumeInfo.pageCount ?? null,
    genre: volumeInfo.categories?.join(", ") ?? null,
    yearPublished: extractYear(volumeInfo.publishedDate),
  };
}

// Fetch a certain number of books for one author from Google Books API
async function fetchBooksByAuthor(
  author: string,
  totalBooks: number
): Promise<GoogleBook[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const allBooks: GoogleBook[] = [];
  const maxResultsPerRequest = 10;

  for (
    let startIndex = 0;
    allBooks.length < totalBooks;
    startIndex += maxResultsPerRequest
  ) {
    const query = encodeURIComponent(`inauthor:${author}`);
    const url =
      `https://www.googleapis.com/books/v1/volumes` +
      `?q=${query}` +
      `&startIndex=${startIndex}` +
      `&maxResults=${maxResultsPerRequest}` +
      `&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Google Books API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as GoogleBooksResponse;
    const items = data.items ?? [];

    if (items.length === 0) {
      break;
    }

    allBooks.push(...items);
  }

  return allBooks.slice(0, totalBooks);
}

// Remove duplicates inside this import run by Google Books id
function removeDuplicateBooks(mappedBooks: MappedBook[]): MappedBook[] {
  const seenGoogleBooksIds = new Set<string>();

  return mappedBooks.filter((mappedBook) => {
    if (seenGoogleBooksIds.has(mappedBook.googleBooksId)) {
      return false;
    }

    seenGoogleBooksIds.add(mappedBook.googleBooksId);
    return true;
  });
}

// Insert all books into the database.
// If a book with the same googleBooksId already exists, skip it
async function insertBooks(mappedBooks: MappedBook[]): Promise<void> {
  if (mappedBooks.length === 0) {
    console.log("No books to insert");
    return;
  }

  const booksToInsert = mappedBooks.map((mappedBook) => ({
    id: crypto.randomUUID(),
    title: mappedBook.title,
    author: mappedBook.author,
    description: mappedBook.description,
    coverUrl: mappedBook.coverUrl,
    genre: mappedBook.genre,
    pageCount: mappedBook.pageCount,
    yearPublished: mappedBook.yearPublished,
    googleBooksId: mappedBook.googleBooksId,
  }));

  await db.insert(book).values(booksToInsert).onConflictDoNothing({
    target: book.googleBooksId,
  });

  console.log(`Tried to insert ${booksToInsert.length} books`);
}

async function main(): Promise<void> {
  // Read all authors from the txt file
  const authors = await getAuthorsFromFile("./data/authors.txt");

  const booksPerAuthor = 5;

  // Collect all cleaned books here before deduplication and insert
  const allMappedBooks: MappedBook[] = [];

  for (const author of authors) {
    try {
      // Fetch books from Google Books API for the current author
      const googleBooks = await fetchBooksByAuthor(author, booksPerAuthor);

      // Keep only books where the author name matches exactly
      const booksWithExactAuthorMatch = googleBooks.filter((googleBook) =>
        hasExactAuthorMatch(googleBook, author)
      );

      // Clean the books and skip incomplete ones
      const mappedBooks = booksWithExactAuthorMatch
        .map(mapGoogleBook)
        .filter((mappedBook): mappedBook is MappedBook => mappedBook !== null);

      console.log(
        `${author}: fetched=${googleBooks.length}, matched=${booksWithExactAuthorMatch.length}, mapped=${mappedBooks.length}`
      );

      allMappedBooks.push(...mappedBooks);
    } catch (error) {
      // If one author fails, log it and continue with the next one
      console.error(`Failed to fetch books for author: ${author}`);
      console.error(error);
    }

    await sleep(1000);
  }

  // Remove duplicates before inserting into the database
  const uniqueBooks = removeDuplicateBooks(allMappedBooks);

  console.log(`Total books before deduplication: ${allMappedBooks.length}`);
  console.log(`Total books after deduplication: ${uniqueBooks.length}`);

  // Insert the final list of books into the database
  await insertBooks(uniqueBooks);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
