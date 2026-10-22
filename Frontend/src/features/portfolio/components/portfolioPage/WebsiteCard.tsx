import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { WebsiteProject } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";

type WebsiteCardProps = {
  project: WebsiteProject;
  reveal?: boolean;
};

function isCmsMediaSrc(src: string) {
  return (
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.endsWith(".svg")
  );
}

export function WebsiteCard({ project, reveal = false }: WebsiteCardProps) {
  const caseStudyHref = `/portfolio/${project.id}`;
  const frame = (
    <div className={styles.websiteFrame}>
      <Image
        src={project.screenshotUrl}
        alt={`${project.title} full-page screenshot`}
        width={project.screenshotWidth}
        height={project.screenshotHeight}
        className={styles.websiteImage}
        sizes="(max-width: 550px) 100vw, (max-width: 850px) 50vw, 33vw"
        unoptimized={isCmsMediaSrc(project.screenshotUrl)}
      />
    </div>
  );

  return (
    <article
      id={project.id}
      className={`${styles.websiteCard}${reveal ? ` ${styles.revealItem}` : ""}`}
    >
      <Link href={caseStudyHref}>
        {frame}
        <h3 className={`${styles.websiteTitle} typeHeading`}>{project.title}</h3>
      </Link>
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="typeMeta mt-2 inline-block text-[var(--nav-muted)] underline-offset-2 hover:underline"
        >
          Visit live site
        </a>
      ) : null}
    </article>
  );
}
