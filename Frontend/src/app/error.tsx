"use client";

import Link from "next/link";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-28">
      <h1 className="typeHeading text-white">Something went wrong</h1>
      <p className="typeBody mt-4 text-[var(--nav-muted)]">
        We could not render this page. Try again, or return home if the problem
        continues.
      </p>
      {error.digest ? (
        <p className="typeMeta mt-2 text-[var(--nav-muted)]">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
