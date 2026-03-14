import { queryOptions } from "@tanstack/react-query";
import { api, apiCall } from "@/lib/eden";

// For the home page, we might fetch recent activity or similar.
// Currently reusing projects as placeholders for home data if needed.
export const getHomeDataQueryOptions = (headers?: Record<string, string>) =>
  queryOptions({
    queryKey: ["home", "data"],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(
        api.projects.get(headers ? { headers } : undefined)
      );
      return res;
    },
  });

export const getUserProfileQueryOptions = (headers?: Record<string, string>) =>
  queryOptions({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(
        api.user.profile.get(headers ? { headers } : undefined)
      );
      return res;
    },
  });
 