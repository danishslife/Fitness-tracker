export interface Exercise {
  id: number;
  name: string;
  targetMuscleGroup: string;
}

export interface ExercisesResponse {
  exercises: Exercise[];
}

export interface ApiErrorResponse {
  message: string;
}
