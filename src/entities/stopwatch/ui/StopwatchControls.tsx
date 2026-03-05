import React from "react";
import { Button } from '@/shared/ui/Button/Button';
import { ButtonVariant } from '@/shared/ui/Button/Button.types';
import { IconPlay, IconPause } from "@/shared/ui/Icon/icons";
import { StopwatchStatus } from "../model/types";

interface StopwatchControlsProps {
  status: StopwatchStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const StopwatchControls: React.FC<StopwatchControlsProps> = React.memo(({
  status,
  onStart,
  onPause,
  onResume,
}) => {
  const isIdle = status === StopwatchStatus.IDLE;
  const isRunning = status === StopwatchStatus.RUNNING;

  console.log('Stopwatch Controls');

  return (
    <>
      {isIdle ? (
        <Button variant={ButtonVariant.START} onClick={onStart} ariaLabel="Start">
          <IconPlay /> Start
        </Button>
      ) : (
        <>
          {isRunning ? (
            <Button variant={ButtonVariant.PAUSE} onClick={onPause} ariaLabel="Pause">
              <IconPause /> Pause
            </Button>
          ) : (
            <Button variant={ButtonVariant.START} onClick={onResume} ariaLabel="Resume">
              <IconPlay /> Resume
            </Button>
          )}
        </>
      )}
    </>
  );
});