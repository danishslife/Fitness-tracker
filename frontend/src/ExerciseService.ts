import type {
  ApiErrorResponse,
  DeleteExerciseResponse,
  Exercise,
  ExercisesResponse,
} from "./types/exercise";

async function parseResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiErrorResponse;

  if (res.ok) {
    return data as T;
  }

  throw new Error((data as ApiErrorResponse).message);
}

export async function getAllExercises(
  page: number,
  name: string,
  selectedDate: Date,
): Promise<ExercisesResponse> {
  console.log(selectedDate);
  const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/?page=${page}&name=${name}&startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`,
  );

  return parseResponse<ExercisesResponse>(res);
}

export async function getOneExercise(exerciseId: string): Promise<Exercise> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId}`,
  );

  return parseResponse<Exercise>(res);
}

export async function createOneExercise(
  exercise: Omit<Exercise, "_id">,
): Promise<Exercise> {
  const { name, weight, reps } = exercise;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exercise/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, weight, reps }),
  });

  return parseResponse<Exercise>(res);
}

export async function updateOneExercise(
  exerciseId: string,
  name?: string,
  weight?: number,
  reps?: number,
): Promise<Exercise> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, weight, reps }),
    },
  );

  return parseResponse<Exercise>(res);
}

export async function deleteOneExercise(
  exerciseId: string,
): Promise<DeleteExerciseResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/exercise/${exerciseId}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse<DeleteExerciseResponse>(res);
}
