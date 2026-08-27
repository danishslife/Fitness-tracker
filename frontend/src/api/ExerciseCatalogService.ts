import type {
  ApiErrorResponse,
  ExerciseCatalog,
  ExercisesCatalogResponse,
} from "../types/exercise";

async function parseResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiErrorResponse;

  if (res.ok) {
    return data as T;
  }

  throw new Error((data as ApiErrorResponse).message);
}

export async function getAllExerciseCatalog(): Promise<ExercisesCatalogResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/exerciseCatalog/`,
  );

  return parseResponse<ExercisesCatalogResponse>(res);
}

export async function createOneExerciseCatalog(
  exerciseCatalog: Omit<ExerciseCatalog, "_id">,
): Promise<ExerciseCatalog> {
  const { name, targetMuscleGroup } = exerciseCatalog;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exerciseCatalog/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, targetMuscleGroup }),
  });

  return parseResponse<ExerciseCatalog>(res);
}
