"use client";

import { Toaster } from "@book-review-platform/ui/components/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/trpc";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* component that shows toast notifications on the screen */}
      <Toaster richColors />
    </QueryClientProvider>
  );
}
