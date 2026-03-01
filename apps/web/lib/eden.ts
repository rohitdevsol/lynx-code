
import { treaty } from "@elysiajs/eden";
import type { App } from "@server/index";


export const api: ReturnType<typeof treaty<App>> = treaty<App>(
  process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL || "http://localhost:4000",
  {
    fetch: {
      credentials: "include",
    },
  }
);


export async function apiCall<T>(promise: Promise<{ data: T | null; error: any }>) {
  const { data, error } = await promise;

  if (error) {
    console.error("API Error:", error);
    throw new Error(error?.value?.message || error.message || "API request failed");
  }

  return data;
}
