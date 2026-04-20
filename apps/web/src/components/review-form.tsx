"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import {
  createReviewSchema,
  updateReviewSchema,
} from "@book-review-platform/api/domains/review/validation";
import { trpc } from "@/lib/trpc";
import { tryCatch } from "@/lib/utils";

type ReviewFormProps =
  | {
      mode: "create";
      bookId: string;
      onSuccess?: () => void;
    }
  | {
      mode: "edit";
      reviewId: string;
      initialRating: number;
      initialContent: string | null;
      onCancel: () => void;
      onSuccess?: () => void;
    };

export function ReviewForm(props: ReviewFormProps) {
  const router = useRouter();
  const isEditMode = props.mode === "edit";

  const createMutation = useMutation(trpc.review.create.mutationOptions());
  const updateMutation = useMutation(trpc.review.update.mutationOptions());
  const activeMutation = isEditMode ? updateMutation : createMutation;

  const form = useForm({
    defaultValues: {
      rating: isEditMode ? String(props.initialRating) : "",
      content: isEditMode ? props.initialContent ?? "" : "",
    },
    onSubmit: async ({ value }) => {
      const rating = Number(value.rating);
      const content = value.content || undefined;

      if (isEditMode) {
        return submitEdit({
          reviewId: props.reviewId,
          rating,
          content,
        });
      }

      return submitCreate({
        bookId: props.bookId,
        rating,
        content,
      });
    },
  });

  async function submitEdit(input: {
    reviewId: string;
    rating: number;
    content: string | undefined;
  }) {
    const parsed = updateReviewSchema.safeParse(input);
    if (!parsed.success) return;

    const result = await tryCatch(updateMutation.mutateAsync(parsed.data));

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    router.refresh();
    if (props.mode === "edit") {
      props.onCancel(); // paslepia forma, parodo paprasta apzvalgos vaizda
    }
  }

  async function submitCreate(input: {
    bookId: string;
    rating: number;
    content: string | undefined;
  }) {
    const parsed = createReviewSchema.safeParse(input);
    if (!parsed.success) return;

    const result = await tryCatch(createMutation.mutateAsync(parsed.data));

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    router.refresh();
    props.onSuccess?.();
  }

  const submitLabel = isEditMode
    ? updateMutation.isPending
      ? "Saving..."
      : "Save changes"
    : createMutation.isPending
    ? "Submitting..."
    : "Submit review";

  const ratingSchema = isEditMode
    ? updateReviewSchema.shape.rating
    : createReviewSchema.shape.rating;
  const contentSchema = isEditMode
    ? updateReviewSchema.shape.content
    : createReviewSchema.shape.content;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mt-3 space-y-4"
    >
      <form.Field
        name="rating"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Rating is required";
            const result = ratingSchema.safeParse(Number(value));
            if (!result.success) return result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4a3428]">
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
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="content"
        validators={{
          onChange: ({ value }) => {
            if (!value) return undefined;
            const result = contentSchema.safeParse(value);
            if (!result.success) return result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#4a3428]">
              Review{" "}
              <span className="font-normal text-[#a48b78]">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full rounded-2xl border border-[#e2d3bd] bg-white px-4 py-3 text-[#4a3428] outline-none transition focus:border-[#b88b52]"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {activeMutation.error && (
        <p className="text-sm text-red-600">{activeMutation.error.message}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={activeMutation.isPending}
          className="rounded-2xl bg-[#4a3428] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5a4031] disabled:opacity-50"
        >
          {submitLabel}
        </button>

        {isEditMode && (
          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-2xl border border-[#dcc9ac] bg-white px-6 py-3 text-sm font-medium text-[#4b3527] transition hover:bg-[#f3e7d3]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
