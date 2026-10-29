import type {
  ApiErrorResponse,
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

export async function getAllExercises(): Promise<ExercisesResponse> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/`,
  );

  return parseResponse<ExercisesResponse>(res);
}

export async function createOneExercise(
  exercise: Omit<Exercise, "id">,
): Promise<Exercise> {
  const { name, targetMuscleGroup } = exercise;
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/exercise/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, targetMuscleGroup }),
  });

  return parseResponse<Exercise>(res);
}
