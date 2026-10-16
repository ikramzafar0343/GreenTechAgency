import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicSubserviceDetail } from "@/features/services/server/getPublicSubserviceDetail";

type SubserviceDetailPageProps = {
  detail: PublicSubserviceDetail;
};

export function SubserviceDetailPage({ detail }: SubserviceDetailPageProps) {
  const serviceHref = `/services/${detail.serviceSlug}`;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-28 sm:px-8">
      <p className="typeMeta text-[var(--nav-muted)]">
        <Link href={serviceHref} className="hover:text-white">
          {detail.serviceSlug.replace(/-/g, " ")}
        </Link>
      </p>
      <h1 className="typeHero mt-4 text-white">{detail.title}</h1>
      <p className="typeLead measureLead mt-8 text-[var(--nav-muted)]">
        {detail.summary}
      </p>
      {detail.cardImageSrc ? (
        <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl">
          <Image
            src={detail.cardImageSrc}
            alt={detail.cardImageAlt || detail.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
          />
        </div>
      ) : null}
      <div className="typeProse mt-10 text-white/90">
        {detail.body.split(/\n\n+/).map((paragraph, index) => (
          <p key={`${detail.id}-p-${index}`}>{paragraph}</p>
        ))}
      </div>
      {detail.ctaHref && detail.ctaLabel ? (
        <div className="mt-12">
          <Link
            href={detail.ctaHref}
            className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
          >
            {detail.ctaLabel}
          </Link>
        </div>
      ) : null}
      <div className="mt-12">
        <Link
          href={serviceHref}
          className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
        >
          Back to service
        </Link>
      </div>
    </main>
  );
}
