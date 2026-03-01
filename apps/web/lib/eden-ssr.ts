import { headers } from "next/headers";

export async function getSSRApiHeaders(): Promise<Record<string, string>> {
  if (typeof window === "undefined") {
    try {
      const h = await headers();
      const cookie = h.get("cookie");
      return cookie ? { cookie } : {};
    } catch (e) {
      return {};
    }
  }
  return {};
}
