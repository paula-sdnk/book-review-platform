"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@book-review-platform/ui/components/dropdown-menu";
import { Skeleton } from "@book-review-platform/ui/components/skeleton";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-6 w-20 rounded-md" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-[#6b4f3f] transition hover:text-[#c89b5a]"
      >
        Log in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-[#6b4f3f] underline underline-offset-4 transition hover:text-[#c89b5a]"
          />
        }
      >
        My account
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 border-[#e8d9c5] rounded-lg bg-[#fffaf3] text-[#5c4033]">
        <DropdownMenuGroup>
          <div className="px-2 py-1.5">
            <p className="font-semibold text-[#4b3527]">{session.user.name}</p>
            <p className="text-sm text-[#7a6656]">{session.user.email}</p>
          </div>

          <DropdownMenuSeparator />

          <Link href="/dashboard">
            <DropdownMenuItem>My dashboard</DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
