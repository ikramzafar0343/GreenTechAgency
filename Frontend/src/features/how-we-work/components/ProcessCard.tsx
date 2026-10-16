import type { ProcessStage } from "@/features/how-we-work/model/processStages";
import chrome from "@/features/how-we-work/styles/boardChrome.module.css";
import styles from "@/features/how-we-work/styles/howWeWork.module.css";

type ProcessCardProps = {
  stage: ProcessStage;
  className?: string | undefined;
  showGrip?: boolean;
  gripDescribedBy?: string;
  onGripPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onGripKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export function ProcessCard({
  stage,
  className,
  showGrip = false,
  gripDescribedBy,
  onGripPointerDown,
  onGripKeyDown,
}: ProcessCardProps) {
  const cardClass =
    stage.appearance === "accent" ? styles.cardAccent : styles.cardDark;

  return (
    <article
      className={[styles.card, cardClass, className].filter(Boolean).join(" ")}
      data-hww-body
    >
      {showGrip ? (
        <button
          type="button"
          className={chrome.grip}
          data-hww-grip="true"
          aria-label={`Move ${stage.title} card`}
          aria-describedby={gripDescribedBy}
          onPointerDown={onGripPointerDown}
          onKeyDown={onGripKeyDown}
        >
          <span className={chrome.gripDots} aria-hidden="true" />
        </button>
      ) : null}
      <h3 className={`${styles.cardTitle} typeCardTitle`}>{stage.title}</h3>
      <ul className={`${styles.bullets} typeBody`}>
        {stage.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p className={`${styles.outcome} typeSmall`}>{stage.outcome}</p>
    </article>
  );
}
