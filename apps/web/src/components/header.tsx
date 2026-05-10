"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import UserMenu from "./user-menu";

import { authClient } from "@/lib/auth-client";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const links = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
  ] as const;

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function openMobileMenu() {
    setMobileMenuOpen(true);
  }

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          closeMobileMenu();
          router.push("/");
        },
      },
    });
  }

  return (
    <>
      <header className="border-b border-[#e8d9c5] bg-[#fdf7ee]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <div className="flex items-center gap-6 sm:gap-16">
            <Link
              href="/"
              className="text-xl font-semibold tracking-wide text-[#5c4033] sm:text-2xl"
            >
              BookLeaf
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  href={to}
                  className="text-base font-medium text-[#6b4f3f] transition hover:text-[#c89b5a]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex">
              <UserMenu />
            </div>

            <button
              type="button"
              onClick={openMobileMenu}
              className="rounded-md p-2 text-[#5c4033] transition hover:bg-[#f3e7d3] md:hidden"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={closeMobileMenu}
          />

          <div className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-[#fdf7ee] p-6 shadow-xl md:hidden">
            <div className="mb-10 flex items-center justify-between">
              <p className="text-xl font-semibold text-[#5c4033]">BookLeaf</p>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-md p-2 text-[#5c4033] transition hover:bg-[#f3e7d3]"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  href={to}
                  onClick={closeMobileMenu}
                  className="text-lg font-medium text-[#4b3527]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-[#e8d9c5] pt-5">
              {isPending ? (
                <p className="text-sm text-[#7a6656]">Loading...</p>
              ) : session ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-semibold text-[#4b3527]">
                      {session.user.name}
                    </p>
                    <p className="text-sm text-[#7a6656]">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="text-base font-medium text-[#4b3527]"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-left text-base font-medium text-red-500"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="text-base font-medium text-[#4b3527]"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
