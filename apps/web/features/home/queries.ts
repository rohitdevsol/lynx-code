import { queryOptions } from "@tanstack/react-query";
import { api, apiCall } from "@/lib/eden";

// For the home page, we might fetch recent activity or similar.
// Currently reusing projects as placeholders for home data if needed.
export const getHomeDataQueryOptions = (reqHeaders?: Record<string, string>) =>
  queryOptions({
    queryKey: ["home", "data"],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(api.projects.get({
        query: {
           // mock fetching latest 5 projects
        },
        ...(reqHeaders ? { headers: reqHeaders } : {})
      }));
      return res;
    },
  });
