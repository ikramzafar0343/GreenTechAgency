import styles from "@/features/how-we-work/styles/boardChrome.module.css";

type BoardControlsProps = {
  disabled: boolean;
  onRearrange: () => void;
  onReset: () => void;
};

export function BoardControls({
  disabled,
  onRearrange,
  onReset,
}: BoardControlsProps) {
  return (
    <div className={styles.boardControls}>
      <button
        type="button"
        className={styles.layoutButton}
        onClick={onRearrange}
        disabled={disabled}
      >
        Re-arrange
      </button>
      <button
        type="button"
        className={styles.layoutButton}
        onClick={onReset}
        disabled={disabled}
      >
        Reset layout
      </button>
    </div>
  );
}
