import React, { useMemo } from "react";
import { StopwatchStatus } from "../model/types";
import { useStopwatch } from "../model/useStopwatch";
import { TimeDisplay } from "./TimeDisplay";
import { StopwatchControls } from "./StopwatchControls";
import { StopwatchHeader } from "./StopwatchHeader";
import { Button } from "@/shared/ui/Button/Button";
import { ButtonVariant } from "@/shared/ui/Button/Button.types";
import { IconSparkles } from "@/shared/ui/Icon/icons";
import styles from "./StopwatchCard.module.css";

interface StopwatchCardProps {
  id: number;
  onDelete: (id: number) => void;
}

export const StopwatchCard: React.FC<StopwatchCardProps> = React.memo(({ id, onDelete }) => {

  const { status, actions, timeRef } = useStopwatch(id);

  const clearButton = useMemo(() => (
    <Button variant={ButtonVariant.CLEAR} onClick={actions.clear} ariaLabel="Clear">
      <IconSparkles /> Clear
    </Button>
  ), [actions.clear]);

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
        {status !== StopwatchStatus.IDLE && clearButton}
      </div>
    </article>
  );
});