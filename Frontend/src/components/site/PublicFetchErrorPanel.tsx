type PublicFetchErrorPanelProps = {
  title: string;
  message?: string;
};

export function PublicFetchErrorPanel({
  title,
  message = "We could not load this content right now. Please try again shortly.",
}: PublicFetchErrorPanelProps) {
  return (
    <section
      className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8"
      aria-live="polite"
      role="status"
    >
      <h2 className="typeSectionTitle text-white">{title}</h2>
      <p className="typeLead measureLead mt-4 text-[var(--nav-muted)]">
        {message}
      </p>
    </section>
  );
}
