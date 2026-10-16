import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-28">
      <h1 className="typeHeading text-white">Page not found</h1>
      <p className="typeBody mt-4 text-[var(--nav-muted)]">
        The page you requested does not exist or is no longer available.
      </p>
      <Link
        href="/"
        className="typeButton mt-8 inline-flex w-fit items-center rounded-full border border-white/30 px-5 py-3 text-white"
      >
        Back to home
      </Link>
    </main>
  );
}
