import { queryOptions } from "@tanstack/react-query";
import { api, apiCall } from "@/lib/eden";

export const getProjectsQueryOptions = (reqHeaders?: Record<string, string>) =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(
        api.projects.get(reqHeaders ? { headers: reqHeaders } : undefined)
      );
      return res;
    },
  });
