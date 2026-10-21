import type {
  ApiErrorResponse,
  CreateExerciseData,
  DeleteExerciseResponse,
  Exercise,
  ExercisesResponse,
} from "../types/exercise";
import { authFetch } from "./authFetch";

async function parseResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiErrorResponse;

  if (res.ok) {
    return data as T;
  }

  throw new Error(
    (data as ApiErrorResponse).message || "Request failed",
  );
}

export async function getAllExercises(
  selectedDate: Date,
): Promise<ExercisesResponse> {
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`,
  );

  return parseResponse<ExercisesResponse>(res);
}

export async function getOneExercise(exerciseId: number): Promise<Exercise> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId}`,
  );

  return parseResponse<Exercise>(res);
}

export async function createOneExercise(
  exercise: CreateExerciseData,
): Promise<Exercise> {
  const { exerciseCatalog, weight, reps, performedAt } = exercise;
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/exercise/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exerciseCatalog, weight, reps, performedAt }),
  });

  return parseResponse<Exercise>(res);
}

export async function updateOneExercise(
  exerciseId: number,
  weight?: number,
  reps?: number,
): Promise<Exercise> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weight, reps }),
    },
  );

  return parseResponse<Exercise>(res);
}

export async function deleteOneExercise(
  exerciseId: number,
): Promise<DeleteExerciseResponse> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse<DeleteExerciseResponse>(res);
}
