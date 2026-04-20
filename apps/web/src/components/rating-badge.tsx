"use client";

type RatingBadgeProps = {
  averageRating: number | null;
  reviewCount: number;
  size?: "sm" | "lg";
};

export function RatingBadge({
  averageRating,
  reviewCount,
  size = "sm",
}: RatingBadgeProps) {
  if (reviewCount === 0 || averageRating === null) {
    return <span className="text-xs text-[#a48b78]">No ratings yet</span>;
  }

  const starSize = size === "lg" ? "32px" : "16px";
  const labelClasses =
    size === "lg" ? "text-base text-[#4b3527]" : "text-xs text-[#6b5646]";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="relative inline-flex text-[#d4bfa0]"
        style={{ fontSize: starSize, lineHeight: 1 }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercentage = Math.min(
            100,
            Math.max(0, (averageRating - (star - 1)) * 100)
          );

          return (
            <span
              key={star}
              className="relative inline-block"
              style={{ width: "1em", height: "1em" }}
            >
              <span className="absolute inset-0">★</span>
              <span
                className="absolute inset-0 overflow-hidden text-[#b88b52]"
                style={{ width: `${fillPercentage}%` }}
              >
                ★
              </span>
            </span>
          );
        })}
      </span>
      <span className={labelClasses}>
        {averageRating} ({reviewCount})
      </span>
    </span>
  );
}
