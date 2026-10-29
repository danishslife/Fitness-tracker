import type { ApiErrorResponse } from "../types/exercise";
import type {
  CreateWorkoutSetData,
  DeleteWorkoutSetResponse,
  WorkoutSet,
  WorkoutSetsResponse,
} from "../types/workoutSet";
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

export async function getAllWorkoutSets(
  selectedDate: Date,
): Promise<WorkoutSetsResponse> {
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/workoutSet/?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`,
  );

  return parseResponse<WorkoutSetsResponse>(res);
}

export async function getOneWorkoutSet(workoutSetId: number): Promise<WorkoutSet> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/workoutSet/${workoutSetId}`,
  );

  return parseResponse<WorkoutSet>(res);
}

export async function createOneWorkoutSet(
  workoutSet: CreateWorkoutSetData,
): Promise<WorkoutSet> {
  const { exercise, weight, reps, performedAt } = workoutSet;
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/workoutSet/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exercise, weight, reps, performedAt }),
    },
  );

  return parseResponse<WorkoutSet>(res);
}

export async function updateOneWorkoutSet(
  workoutSetId: number,
  weight?: number,
  reps?: number,
): Promise<WorkoutSet> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/workoutSet/${workoutSetId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weight, reps }),
    },
  );

  return parseResponse<WorkoutSet>(res);
}

export async function deleteOneWorkoutSet(
  workoutSetId: number,
): Promise<DeleteWorkoutSetResponse> {
  const res = await authFetch(
    `${import.meta.env.VITE_API_URL}/api/workoutSet/${workoutSetId}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse<DeleteWorkoutSetResponse>(res);
}
