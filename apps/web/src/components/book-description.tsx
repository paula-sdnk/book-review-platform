"use client";

import { useState } from "react";

type BookDescriptionProps = {
  description: string;
};

const DESCRIPTION_PREVIEW_LENGTH = 300;

export function BookDescription({ description }: BookDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = description.length > DESCRIPTION_PREVIEW_LENGTH;

  const visibleDescription =
    isExpanded || !shouldTruncate
      ? description
      : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}...`;

  return (
    <div className="mt-3">
      <p className="leading-7 text-muted-foreground">{visibleDescription}</p>

      {shouldTruncate ? (
        <button
          type="button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          className="cursor-pointer mt-3 text-sm font-medium underline underline-offset-4"
        >
          {isExpanded ? "Show less" : "View more"}
        </button>
      ) : null}
    </div>
  );
}
