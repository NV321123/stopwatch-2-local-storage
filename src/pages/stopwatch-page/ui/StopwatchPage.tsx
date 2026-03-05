import React, { useState, useEffect, useCallback } from "react";
import { StopwatchCard } from "@/entities/stopwatch/ui/StopwatchCard";
import { Button } from '@/shared/ui/Button/Button';
import { ButtonVariant } from '@/shared/ui/Button/Button.types';
import { IconPlus } from "@/shared/ui/Icon/icons";
import styles from "./StopwatchPage.module.css";

const STORAGE_IDS_KEY = "stopwatch_ids";
const STORAGE_NEXT_ID_KEY = "stopwatch_next_id";

const StopwatchHeaderAdd: React.FC<{ onAdd: () => void }> = React.memo(({ onAdd }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Stopwatch</h1>
      <Button
        variant={ButtonVariant.ADD}
        onClick={onAdd}
        ariaLabel="Add new stopwatch"
      >
        <IconPlus className={styles.icon} /> Add New Stopwatch
      </Button>
    </header>
  );
});

export const StopwatchPage: React.FC = () => {
  const [stopwatches, setStopwatches] = useState<number[]>(() => {
    try {
      const savedIds = localStorage.getItem(STORAGE_IDS_KEY);
      return savedIds ? JSON.parse(savedIds) : [];
    } catch (e) {
      console.error("Failed to load page state (stopwatches)", e);
      return [];
    }
  });

  const [nextId, setNextId] = useState<number>(() => {
    try {
      const savedNextId = localStorage.getItem(STORAGE_NEXT_ID_KEY);
      return savedNextId ? JSON.parse(savedNextId) : 1;
    } catch (e) {
      console.error("Failed to load page state (nextId)", e);
      return 1;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_IDS_KEY, JSON.stringify(stopwatches));
    } catch (e) {
      console.error("Failed to save stopwatch IDs", e);
    }
  }, [stopwatches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NEXT_ID_KEY, JSON.stringify(nextId));
    } catch (e) {
      console.error("Failed to save next ID", e);
    }
  }, [nextId]);

  const addStopwatch = useCallback(() => {
    setNextId(prev => {
      const newId = prev;
      setStopwatches(current => [...current, newId]);
      return newId + 1;
    });
  }, []);

  const deleteStopwatch = useCallback((id: number) => {
    setStopwatches(prev => {
      const newList = prev.filter(s => s !== id);
      try {
        localStorage.removeItem(`stopwatch_data_${id}`);
      } catch (e) {
        console.error(`Failed to delete stopwatch data for ID ${id}`, e);
      }
      return newList;
    });
  }, []);

  return (
    <div className={styles.container}>
      <StopwatchHeaderAdd onAdd={addStopwatch} />

      <main>
        <div className={styles.grid}>
          {stopwatches.map(id => (
            <StopwatchCard
              key={id}
              id={id}
              onDelete={deleteStopwatch}
            />
          ))}
        </div>
      </main>
    </div>
  );
};