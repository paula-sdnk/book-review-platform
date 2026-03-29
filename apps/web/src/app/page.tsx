import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-20">
        <section className="flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#c89b5a]">
            Book review platform
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#5c4033] sm:text-6xl">
            BookLeaf
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7a6656]">
            Discover books, explore details and begin building your own reading
            space with BookLeaf.
          </p>

          <div className="mt-10">
            <Link
              href="/books"
              className="rounded-full bg-[#c89b5a] px-8 py-4 text-base font-medium text-white transition hover:bg-[#b88544]"
            >
              Explore books
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
