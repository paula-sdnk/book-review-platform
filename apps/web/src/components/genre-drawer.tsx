"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import type { Route } from "next";

type Genre = { value: string; label: string };

export function GenreDrawer({
  genres,
  activeGenre,
}: {
  genres: readonly Genre[];
  activeGenre: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-xl border border-[#dcc9ac] bg-white px-3 py-1.5 text-xs font-medium text-[#4b3527]"
        aria-label="Browse by genre"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Genre
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="relative ml-auto h-full w-64 bg-[#fdf7ee] px-5 py-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b48953]">
                Browse by genre
              </p>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4 text-[#4b3527]" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {genres.map((g) => (
                <Link
                  key={g.value}
                  href={`/books?genre=${g.value}` as Route}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    activeGenre === g.value
                      ? "bg-[#b48953] font-medium text-white"
                      : "text-[#4b3527] hover:bg-[#f3e7d3]"
                  }`}
                >
                  {g.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
