import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ArtworkProject } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";

type ArtworkCardProps = {
  project: ArtworkProject;
  onOpen: (project: ArtworkProject) => void;
};

function isCmsMediaSrc(src: string) {
  return (
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.endsWith(".svg")
  );
}

export function ArtworkCard({ project, onOpen }: ArtworkCardProps) {
  return (
    <div id={project.id} className={styles.artworkCard}>
      <button
        type="button"
        className={styles.artworkMedia}
        onClick={() => onOpen(project)}
        aria-label={`Open gallery for ${project.title}`}
      >
        <Image
          src={project.coverUrl}
          alt=""
          width={project.coverWidth}
          height={project.coverHeight}
          className={styles.artworkImage}
          sizes="(max-width: 550px) 100vw, (max-width: 850px) 50vw, 33vw"
          unoptimized={isCmsMediaSrc(project.coverUrl)}
        />
      </button>
      <Link
        href={`/portfolio/${project.id}`}
        className={`${styles.artworkTitle} typeHeading`}
      >
        {project.title}
      </Link>
    </div>
  );
}
