"use client";

import Link from "next/link";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
  ] as const;

  return (
    <header className="border-b border-[#e8d9c5] bg-[#fdf7ee]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-16">
          <Link
            href="/"
            className="text-xl font-semibold tracking-wide text-[#5c4033]"
          >
            BookLeaf
          </Link>

          <nav className="flex items-center gap-10">
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

        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
