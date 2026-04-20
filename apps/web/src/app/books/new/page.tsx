import { headers } from "next/headers";
import { auth } from "@book-review-platform/auth";
import { redirect } from "next/navigation";
import { CreateBookForm } from "./create-book-form";

export default async function CreateBookPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/books");
  }

  return <CreateBookForm />;
}
