"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { tryCatch } from "@/lib/utils";
import { ReviewActionsDropdown } from "./review-actions-dropdown";
import { ReviewForm } from "./review-form";

export type Review = {
  id: string;
  rating: number;
  content: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
};

type ReviewCardProps = {
  review: Review;
  canUserEdit: boolean;
};

export function ReviewCard({ review, canUserEdit }: ReviewCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteMutation = useMutation(trpc.review.remove.mutationOptions());

  async function handleDelete() {
    const result = await tryCatch(
      deleteMutation.mutateAsync({ reviewId: review.id })
    );

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    router.refresh();
  }

  const showActions = canUserEdit && !isEditing;

  return (
    <div className="rounded-2xl border border-[#e7d8bf] bg-[#fffdf8] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#4a3428]">
          {review.user.name}
        </span>

        <div className="flex items-center gap-3">
          {showActions && !confirmDelete && (
            <ReviewActionsDropdown
              onEdit={() => setIsEditing(true)}
              onDelete={() => setConfirmDelete(true)}
            />
          )}

          {showActions && confirmDelete && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-xs font-medium text-red-600 transition hover:text-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs font-medium text-[#6b5646] transition hover:text-[#4b3527]"
              >
                Cancel
              </button>
            </div>
          )}

          <span className="text-xs text-[#a48b78]">
            {new Date(review.createdAt).toLocaleDateString("en-GB")}
          </span>
        </div>
      </div>

      {isEditing ? (
        <ReviewForm
          mode="edit"
          reviewId={review.id}
          initialRating={review.rating}
          initialContent={review.content}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="mt-1 text-[#b88b52]">
            {"★".repeat(review.rating)}
            <span className="text-[#d4bfa0]">
              {"★".repeat(5 - review.rating)}
            </span>
          </div>

          {review.content && (
            <p className="mt-3 text-sm text-[#6b5646]">{review.content}</p>
          )}
        </>
      )}
    </div>
  );
}
