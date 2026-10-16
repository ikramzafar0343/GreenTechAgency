import Image from "next/image";
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
      {project.href ? (
        <a href={project.href} target="_blank" rel="noreferrer">
          {frame}
        </a>
      ) : (
        frame
      )}
      <h3 className={`${styles.websiteTitle} typeHeading`}>{project.title}</h3>
    </article>
  );
}
