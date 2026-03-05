import React, { useCallback } from "react";
import { IconTrash } from "@/shared/ui/Icon/icons";
import styles from "./StopwatchCard.module.css";

interface StopwatchHeaderProps {
  id: number;
  onDelete: (id: number) => void;
}

export const StopwatchHeader: React.FC<StopwatchHeaderProps> = React.memo(({ id, onDelete }) => {
  const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);

  console.log('Stopwatch Header')

  return (
    <div className={styles.header}>
      <span className={styles.title}>{id}</span>
      <button
        onClick={handleDelete}
        className={styles.deleteBtn}
        aria-label="Delete stopwatch"
      >
        <IconTrash className={styles.icon} />
      </button>
    </div>
  );
});