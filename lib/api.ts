
import type { Workout } from "@/types/workout";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";
const FALLBACK_URL = "https://api.api-store.workers.dev/api/fitlog";

export async function getWorkouts(): Promise<Workout[]> {
  let lastError: unknown;

  for (const url of [API_URL, FALLBACK_URL]) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        return data as Workout[];
      }

      throw new Error("Unexpected workout data format.");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to load workouts.");
}

export async function getWorkout(
  id: string
): Promise<Workout | null> {
  for (const baseUrl of [API_URL, FALLBACK_URL]) {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        return (
          (data as Workout[]).find(
            (item) => String(item.id) === id
          ) ?? null
        );
      }

      if (
        data !== null &&
        typeof data === "object" &&
        "id" in data
      ) {
        return data as Workout;
      }
    } catch {
      // Try the alternative API.
    }
  }

  return null;
}
