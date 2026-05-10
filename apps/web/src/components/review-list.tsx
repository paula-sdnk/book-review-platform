"use client";

import { ReviewCard, type Review } from "./review-card";

type ReviewListProps = {
  reviews: Review[];
  currentUserId: string | null;
  currentUserRole: string | null;
};

export function ReviewList({
  reviews,
  currentUserId,
  currentUserRole,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[#a48b78]">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = currentUserId === review.user.id;
        const IsAdmin = currentUserRole === "ADMIN";

        return (
          <ReviewCard
            key={review.id}
            review={review}
            canUserEdit={isOwner}
            canUserDelete={isOwner || IsAdmin}
          />
        );
      })}
    </div>
  );
}
