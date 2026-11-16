import { Link } from "@/i18n/navigation";
import type { WebsiteProject } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";
import { PlayOnViewSvg } from "@/shared/media/PlayOnViewSvg";

type WebsiteCardProps = {
  project: WebsiteProject;
  reveal?: boolean;
};

export function WebsiteCard({ project, reveal = false }: WebsiteCardProps) {
  const caseStudyHref = `/portfolio/${project.id}`;
  const frame = (
    <div className={styles.websiteFrame}>
      <PlayOnViewSvg
        src={project.screenshotUrl}
        alt={`${project.title} full-page screenshot`}
        width={project.screenshotWidth}
        height={project.screenshotHeight}
        className={styles.websiteImage}
        sizes="(max-width: 550px) 100vw, (max-width: 850px) 50vw, 33vw"
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
