"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBookSchema } from "@book-review-platform/api/domains/book/validation";
import { trpc } from "@/lib/trpc";
import { tryCatch } from "@/lib/utils";
import { GENRE_OPTIONS } from "@/lib/genres";

export function CreateBookForm() {
  const router = useRouter();

  const createBookMutation = useMutation(trpc.book.create.mutationOptions());

  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
      description: "",
      coverUrl: "",
      genre: "" as string,
      pageCount: "",
      yearPublished: "",
    },
    onSubmit: async ({ value }) => {
      const input = {
        title: value.title,
        author: value.author,
        description: value.description,
        coverUrl: value.coverUrl || undefined,
        genre: value.genre || undefined,
        pageCount: value.pageCount ? Number(value.pageCount) : null,
        yearPublished: value.yearPublished ? Number(value.yearPublished) : null,
      };

      const parsed = createBookSchema.safeParse(input);

      if (!parsed.success) {
        return;
      }

      const result = await tryCatch(
        createBookMutation.mutateAsync(parsed.data)
      );

      if (result.error) {
        console.log(result.error.message);
        return;
      }

      router.push(`/books/${result.data.bookId}`);
    },
  });

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-16">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="mb-8">
          <Link
            href="/books"
            className="text-sm text-[#6b5646] transition hover:text-[#4b3527]"
          >
            ← Back to books
          </Link>

          <h1 className="mt-4 text-3xl font-semibold text-[#4b3527]">
            Add a new book
          </h1>

          <p className="mt-2 text-[#6b5646]">
            Fill in the details to create a new book.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-8 rounded-3xl border border-[#e2d3bd] bg-[#fbf7ef] p-6 shadow-sm md:p-8"
        >
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) => {
                const result = createBookSchema.shape.title.safeParse(value);
                if (!result.success) return result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-[#4a3428]"
                >
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                />

                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="author"
            validators={{
              onChange: ({ value }) => {
                const result = createBookSchema.shape.author.safeParse(value);
                if (!result.success) return result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-[#4a3428]"
                >
                  Author
                </label>

                <input
                  id="author"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                />

                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const result =
                  createBookSchema.shape.description.safeParse(value);

                if (!result.success) return result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#4a3428]"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={8}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                />

                {field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="coverUrl">
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor="coverUrl"
                  className="block text-sm font-medium text-[#4a3428]"
                >
                  Cover URL
                </label>

                <input
                  id="coverUrl"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="genre">
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-[#4a3428]"
                >
                  Genre
                </label>

                <select
                  id="genre"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                >
                  <option value="">No genre</option>
                  {GENRE_OPTIONS.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form.Field
              name="pageCount"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return undefined;

                  const num = Number(value);
                  const result =
                    createBookSchema.shape.pageCount.safeParse(num);

                  if (!result.success) return result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor="pageCount"
                    className="block text-sm font-medium text-[#4a3428]"
                  >
                    Page count
                  </label>

                  <input
                    id="pageCount"
                    type="number"
                    min={1}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                  />

                  {field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="yearPublished"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return undefined;

                  const num = Number(value);
                  const result =
                    createBookSchema.shape.yearPublished.safeParse(num);

                  if (!result.success) return result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor="yearPublished"
                    className="block text-sm font-medium text-[#4a3428]"
                  >
                    Year published
                  </label>

                  <input
                    id="yearPublished"
                    type="number"
                    min={1450}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
                  />

                  {field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={createBookMutation.isPending}
              className="rounded-2xl bg-[#4a3428] px-6 py-3 text-sm font-medium text-white cursor-pointer transition hover:bg-[#5a4031] disabled:opacity-50"
            >
              {createBookMutation.isPending ? "Creating..." : "Create book"}
            </button>

            <Link
              href="/books"
              className="rounded-2xl border border-[#dcc9ac] bg-white px-6 py-3 text-sm cursor-pointer font-medium text-[#4b3527] transition hover:bg-[#f3e7d3]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
