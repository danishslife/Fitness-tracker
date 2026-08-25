export interface Exercise {
  _id: string;
  exerciseCatalog: ExerciseCatalog;
  weight: number;
  reps: number;
}

export interface ExerciseCatalog {
  _id: string;
  name: string;
  targetMuscleGroup: string;
}

export type CreateExerciseData = {
  exerciseCatalog: string; // catalog _id
  weight: number;
  reps: number;
};

export type UpdateExerciseData = {
  // exerciseCatalog?: string;
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
