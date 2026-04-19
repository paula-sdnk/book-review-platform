type Review = {
  id: string;
  rating: number;
  content: string | null;
  createdAt: Date;
  user: {
    name: string;
  };
};

type ReviewListProps = {
  reviews: Review[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[#a48b78]">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-[#e7d8bf] bg-[#fffdf8] p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#4a3428]">
              {review.user.name}
            </span>
            <span className="text-xs text-[#a48b78]">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-1 text-[#b88b52]">
            {"★".repeat(review.rating)}
            <span className="text-[#d4bfa0]">
              {"★".repeat(5 - review.rating)}
            </span>
          </div>

          {review.content ? (
            <p className="mt-3 text-sm text-[#6b5646]">{review.content}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
