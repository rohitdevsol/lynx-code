import { queryOptions } from "@tanstack/react-query";
import { api, apiCall } from "@/lib/eden";

export const getProjectsQueryOptions = (headers?: Record<string, string>) =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(
        api.projects.get(headers ? { headers } : undefined)
      );
      return res;
    },
  });
