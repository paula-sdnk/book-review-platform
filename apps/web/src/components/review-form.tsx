"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { createReviewSchema } from "@book-review-platform/api/domains/review/validation";
import { trpc } from "@/lib/trpc";
import { tryCatch } from "@/lib/utils";

type ReviewFormProps = {
  bookId: string;
};

export function ReviewForm({ bookId }: ReviewFormProps) {
  const router = useRouter();

  const createReviewMutation = useMutation(
    trpc.review.create.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      rating: "",
      content: "",
    },
    onSubmit: async ({ value }) => {
      const input = {
        bookId,
        rating: Number(value.rating),
        content: value.content || undefined,
      };

      const parsed = createReviewSchema.safeParse(input);

      if (!parsed.success) return;

      const result = await tryCatch(
        createReviewMutation.mutateAsync(parsed.data)
      );

      if (result.error) {
        console.log(result.error.message);
        return;
      }

      router.refresh();
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6 rounded-3xl border border-[#e2d3bd] bg-[#fbf7ef] p-6 shadow-sm md:p-8"
    >
      <form.Field
        name="rating"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Rating is required";
            const result = createReviewSchema.shape.rating.safeParse(
              Number(value)
            );
            if (!result.success) return result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-[#4a3428]"
            >
              Rating (1–5)
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.handleChange(String(star))}
                  className={`text-2xl transition ${
                    Number(field.state.value) >= star
                      ? "text-[#b88b52]"
                      : "text-[#d4bfa0]"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {field.state.meta.errors.length > 0 ? (
              <p className="text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="content"
        validators={{
          onChange: ({ value }) => {
            if (!value) return undefined;
            const result = createReviewSchema.shape.content.safeParse(value);
            if (!result.success) return result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[#4a3428]"
            >
              Review{" "}
              <span className="font-normal text-[#a48b78]">(optional)</span>
            </label>

            <textarea
              id="content"
              rows={4}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Share your thoughts..."
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

      {createReviewMutation.error ? (
        <p className="text-sm text-red-600">
          {createReviewMutation.error.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={createReviewMutation.isPending}
        className="rounded-2xl bg-[#4a3428] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5a4031] disabled:opacity-50"
      >
        {createReviewMutation.isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
