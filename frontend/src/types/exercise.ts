export interface Exercise {
  id: number;
  exerciseCatalog: ExerciseCatalog;
  weight: number;
  reps: number;
  performedAt: string;
}

export interface ExerciseCatalog {
  id: number;
  name: string;
  targetMuscleGroup: string;
}

export type CreateExerciseData = {
  exerciseCatalog: number;
  weight: number;
  reps: number;
  performedAt: string;
};

export type UpdateExerciseData = {
  weight?: number;
  reps?: number;
};

export interface ExercisesResponse {
  exercises: Exercise[];
}
export interface ExercisesCatalogResponse {
  exerciseCatalog: ExerciseCatalog[];
}

export interface ApiErrorResponse {
  message: string;
}

export interface DeleteExerciseResponse {
  message: string;
}
