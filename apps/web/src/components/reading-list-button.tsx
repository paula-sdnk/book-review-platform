"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@book-review-platform/ui/components/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { tryCatch } from "@/lib/utils";

type ReadingStatus = "WANT_TO_READ" | "CURRENTLY_READING" | "READ";

const STATUS_LABELS: Record<ReadingStatus, string> = {
  WANT_TO_READ: "Want to Read",
  CURRENTLY_READING: "Currently Reading",
  READ: "Read",
};

type Props = {
  bookId: string;
  currentStatus: ReadingStatus | null;
};

export function ReadingListButton({ bookId, currentStatus }: Props) {
  const router = useRouter();

  const upsertMutation = useMutation(
    trpc.readingListEntry.upsert.mutationOptions()
  );
  const removeMutation = useMutation(
    trpc.readingListEntry.remove.mutationOptions()
  );

  const isLoading = upsertMutation.isPending || removeMutation.isPending;

  async function handleStatusClick(status: ReadingStatus) {
    const result = await tryCatch(
      upsertMutation.mutateAsync({ bookId, status })
    );

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    router.refresh(); // perkrauna server komponentus ir mygtukas atsinaujina su nauju statusu
  }

  async function handleRemove() {
    const result = await tryCatch(removeMutation.mutateAsync({ bookId }));

    if (result.error) {
      console.log(result.error.message);
      return;
    }

    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            disabled={isLoading}
            className={`cursor-pointer flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              currentStatus
                ? "border-[#b48953] bg-[#b48953] text-white hover:bg-[#a07840]"
                : "border-[#e7d8bf] bg-[#fffaf2] text-[#4b3527] hover:border-[#b48953] hover:text-[#b48953]"
            }`}
          />
        }
      >
        {isLoading ? (
          "Saving..."
        ) : currentStatus ? (
          <>
            <span>{STATUS_LABELS[currentStatus]}</span>
            <span className="ml-1 opacity-70">▾</span>
          </>
        ) : (
          <>
            <span>+</span>
            <span>Add to Reading List</span>
            <span className="ml-1 opacity-70">▾</span>
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52 rounded-2xl border-[#e7d8bf] bg-[#fffaf2]">
        <DropdownMenuGroup>
          {(Object.keys(STATUS_LABELS) as ReadingStatus[]).map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusClick(status)}
              className={
                currentStatus === status
                  ? "font-semibold text-[#b48953]"
                  : "text-[#4b3527]"
              }
            >
              {currentStatus === status}
              {STATUS_LABELS[status]}
            </DropdownMenuItem>
          ))}

          {currentStatus && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRemove} variant="destructive">
                Remove from list
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-[#a48b78]">Cancel</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
