import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/server";

export const api = treaty<App>(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
);

export async function apiCall<T>(promise: Promise<{ data: T; error: any }>) {
  const { data, error } = await promise;

  if (error) {
    console.error("API Error:", error);
    throw new Error(error.message || "API request failed");
  }

  return data;
}
