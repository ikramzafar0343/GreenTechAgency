export default function Loading() {
  return (
    <main
      className="flex flex-1 items-center justify-center px-6 py-28"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="typeMeta uppercase text-[var(--nav-muted)]">Loading…</p>
    </main>
  );
}
