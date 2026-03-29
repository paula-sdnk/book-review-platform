import { auth } from "@book-review-platform/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#f6efe3] px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b48953]">
          My dashboard
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#4b3527]">
          Welcome back, {session.user.name}!
        </h1>
      </div>
    </main>
  );
}
