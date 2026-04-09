import React from "react";
import { StopwatchStatus } from "../model/types";
import { useStopwatch } from "../model/useStopwatch";
import { TimeDisplay } from "./TimeDisplay";
import { StopwatchControls, StopwatchClearButton } from "./StopwatchControls";
import { StopwatchHeader } from "./StopwatchHeader";
import styles from "./StopwatchCard.module.css";

interface StopwatchCardProps {
  id: number;
  onDelete: (id: number) => void;
}

export const StopwatchCard: React.FC<StopwatchCardProps> = React.memo(({ id, onDelete }) => {

  const { status, actions, timeRef } = useStopwatch(id);

  console.log('Card')

  return (
    <article className={styles.card} aria-label={`Stopwatch ${id}`}>
      <StopwatchHeader id={id} onDelete={onDelete} />

      <TimeDisplay timeRef={timeRef} />

      <div className={`${styles.controls} ${status !== StopwatchStatus.IDLE ? styles.expanded : ""}`}>
        <StopwatchControls
          status={status}
          onStart={actions.start}
          onPause={actions.pause}
          onResume={actions.resume}
        />
        {status !== StopwatchStatus.IDLE && (
          <StopwatchClearButton onClear={actions.clear} />
        )}
      </div>
    </article>
  );
});
