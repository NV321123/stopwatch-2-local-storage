import React, { useEffect, useRef } from "react";
import { formatTime } from "@/shared/lib/formatTime";
import styles from "./StopwatchCard.module.css";

interface TimeDisplayProps {
  timeRef: React.RefObject<number>;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = React.memo(({ timeRef }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateText = () => {
      if (displayRef.current) {
        displayRef.current.textContent = formatTime(timeRef.current!); 
      }
      animationFrameId = requestAnimationFrame(updateText);
    };

    updateText();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [timeRef]);

  console.log('TimeDisplay');

  return (
    <div 
      ref={displayRef} 
      className={styles.timeDisplay} 
      role="timer" 
      aria-live="off"
      style={{ minWidth: '200px', textAlign: 'center' }}
    >
      00:00:00:00
    </div>
  );
});