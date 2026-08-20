export interface Exercise {
  _id: string;
  name: string;
  weight: number;
  reps: number;
}

export type CreateExerciseData = Omit<Exercise, "_id">;

export type UpdateExerciseData = Partial<CreateExerciseData>;

export interface ExercisesResponse {
  count: number;
  exercises: Exercise[];
}

export interface ApiErrorResponse {
  message: string;
}

export interface DeleteExerciseResponse {
  message: string;
}
