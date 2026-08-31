import type { ApiErrorResponse } from "../types/exercise";
import type { AuthResponse, AuthUser } from "../types/auth";
import { setToken } from "./authToken";
import { authFetch } from "./authFetch";

async function parseResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiErrorResponse;

  if (res.ok) {
    return data as T;
  }

  throw new Error((data as ApiErrorResponse).message || "Request failed");
}

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  const data = await parseResponse<AuthResponse>(res);
  setToken(data.token);
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse<AuthResponse>(res);
  setToken(data.token);
  return data;
}

export async function getUser(): Promise<AuthUser> {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/auth/me`);
  const data = await parseResponse<{ user: AuthUser }>(res);
  return data.user;
}

