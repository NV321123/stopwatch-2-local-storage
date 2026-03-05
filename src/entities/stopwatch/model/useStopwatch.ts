// import { useState, useEffect, useRef } from 'react';
// import { StopwatchStatus } from './types';

// export const useStopwatch = () => {
//   const [status, setStatus] = useState<StopwatchStatus>(StopwatchStatus.IDLE);
//   const [time, setTime] = useState<number>(0);

//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     if (status === StopwatchStatus.RUNNING) {
//       intervalRef.current = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     } else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [status]);

//   const start = () => {
//     if (status === StopwatchStatus.IDLE) {
//       setTime(0);
//     }
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const pause = () => {
//     setStatus(StopwatchStatus.PAUSED);
//   };

//   const resume = () => {
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const clear = () => {
//     setStatus(StopwatchStatus.IDLE);
//     setTime(0);
//   };

//   return {
//     status,
//     time,
//     actions: { start, pause, resume, clear },
//   };
// };





// import { useState, useEffect, useRef } from "react";
// import { StopwatchStatus } from "./types";

// export const useStopwatch = () => {
//   const [status, setStatus] = useState<StopwatchStatus>(StopwatchStatus.IDLE);
//   const [time, setTime] = useState<number>(0);

//   const startTimeRef = useRef<number>(0);
//   const accumulatedTimeRef = useRef<number>(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     if (status === StopwatchStatus.RUNNING) {
//       startTimeRef.current = Date.now();
//       intervalRef.current = setInterval(() => {
//         const now = Date.now();
//         const delta = now - startTimeRef.current;
//         setTime(accumulatedTimeRef.current + delta);
//       }, 10); 
//     } else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [status]);

//   const start = () => {
//     // if (status === StopwatchStatus.IDLE) {
//     //   setTime(0);
//     //   accumulatedTimeRef.current = 0;
//     // }
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const pause = () => {
//     if (status === StopwatchStatus.RUNNING) {
//       accumulatedTimeRef.current += Date.now() - startTimeRef.current;
//       setStatus(StopwatchStatus.PAUSED);
//     }
//   };

//   const resume = () => {
//     setStatus(StopwatchStatus.RUNNING);
//   };

//   const clear = () => {
//     setStatus(StopwatchStatus.IDLE);
//     setTime(0);
//     accumulatedTimeRef.current = 0;
//   };

//   return {
//     status,
//     time,
//     actions: { start, pause, resume, clear },
//   };
// };




import { useState, useEffect, useRef, useCallback, useMemo, startTransition } from "react";
import { StopwatchStatus } from "./types";

const STORAGE_KEY_PREFIX = "stopwatch_data_";

const loadFromStorage = (id: number) => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    if (
      typeof parsed.status !== 'string' || 
      typeof parsed.accumulated !== 'number' ||
      (parsed.status === StopwatchStatus.RUNNING && typeof parsed.startTime !== 'number')
    ) {
      return null;
    }
    
    return parsed;
  } catch (e) {
    console.error("Error loading stopwatch state", e);
    return null;
  }
};

const saveToStorage = (id: number, status: StopwatchStatus, accumulated: number, startTime: number) => {
  try {
    const data = { status, accumulated, startTime };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving stopwatch state", e);
  }
};

export const useStopwatch = (id: number) => {
  const [status, setStatus] = useState<StopwatchStatus>(StopwatchStatus.IDLE);
  const timeRef = useRef<number>(0);
  
  const accumulatedTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (isLoadedRef.current) return;
    
    const savedState = loadFromStorage(id);
    if (savedState) {
      const { status: savedStatus, accumulated: savedAccumulated, startTime: savedStartTime } = savedState;
      
      if (savedStatus === StopwatchStatus.RUNNING) {
        const now = Date.now();
        const elapsedWhileClosed = now - savedStartTime;
        
        accumulatedTimeRef.current = savedAccumulated + elapsedWhileClosed;
        startTimeRef.current = now; 
        timeRef.current = accumulatedTimeRef.current;
        
        startTransition(() => {
          setStatus(StopwatchStatus.RUNNING);
        });
      } else {
        accumulatedTimeRef.current = savedAccumulated;
        startTimeRef.current = 0;
        timeRef.current = savedAccumulated;
        
        startTransition(() => {
          setStatus(savedStatus);
        });
      }
    }
    
    isLoadedRef.current = true;
  }, [id]);

  useEffect(() => {
    if (status === StopwatchStatus.RUNNING) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - startTimeRef.current;
        timeRef.current = accumulatedTimeRef.current + delta;
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const persist = useCallback((currentStatus: StopwatchStatus) => {
    saveToStorage(
      id, 
      currentStatus, 
      accumulatedTimeRef.current, 
      currentStatus === StopwatchStatus.RUNNING ? startTimeRef.current : 0
    );
  }, [id]);

  const start = useCallback(() => {
    if (status === StopwatchStatus.IDLE) {
      timeRef.current = 0;
      accumulatedTimeRef.current = 0;
    }
    
    if (status !== StopwatchStatus.RUNNING) {
      startTimeRef.current = Date.now();
      startTransition(() => setStatus(StopwatchStatus.RUNNING));
      persist(StopwatchStatus.RUNNING);
    }
  }, [status, persist]);

  const pause = useCallback(() => {
    if (status === StopwatchStatus.RUNNING) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      accumulatedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = 0;
      
      startTransition(() => setStatus(StopwatchStatus.PAUSED));
      persist(StopwatchStatus.PAUSED);
    }
  }, [status, persist]);

  const resume = useCallback(() => {
    if (status === StopwatchStatus.PAUSED) {
      startTimeRef.current = Date.now();
      startTransition(() => setStatus(StopwatchStatus.RUNNING));
      persist(StopwatchStatus.RUNNING);
    }
  }, [status, persist]);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    timeRef.current = 0;
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;

    startTransition(() => setStatus(StopwatchStatus.IDLE));
    persist(StopwatchStatus.IDLE);
  }, [persist]);

  const actions = useMemo(
    () => ({ start, pause, resume, clear }),
    [start, pause, resume, clear]
  );

  return {
    timeRef,
    status,
    actions,
  };
};