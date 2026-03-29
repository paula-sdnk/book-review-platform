"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function AppHeader() {
  const pathname = usePathname();

  const shouldHideHeader = pathname === "/login" || pathname === "/sign-up";

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}
