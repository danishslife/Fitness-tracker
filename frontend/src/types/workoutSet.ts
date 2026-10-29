import type { Exercise } from "./exercise";

export interface WorkoutSet {
  id: number;
  exercise: Exercise;
  weight: number;
  reps: number;
  performedAt: string;
}

export type CreateWorkoutSetData = {
  exercise: number;
  weight: number;
  reps: number;
  performedAt: string;
};

export type UpdateWorkoutSetData = {
  weight?: number;
  reps?: number;
};

export interface WorkoutSetsResponse {
  workoutSets: WorkoutSet[];
}

export interface DeleteWorkoutSetResponse {
  message: string;
}
