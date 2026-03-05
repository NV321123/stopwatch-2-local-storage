export enum StopwatchStatus {
  IDLE = "idle",
  RUNNING = "running",
  PAUSED = "paused",
}

export interface StopwatchState {
  id: number;
  status: StopwatchStatus;
  accumulated: number;
  startTime: number;
}