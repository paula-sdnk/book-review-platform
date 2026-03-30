"use client";

import { Toaster } from "@book-review-platform/ui/components/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* component that shows toast notifications on the screen */}
      <Toaster richColors />
    </>
  );
}
