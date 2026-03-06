import { queryOptions } from "@tanstack/react-query";
import { api, apiCall } from "@/lib/eden";

export const getProjectFilesQueryOptions = (projectId: string, headers?: Record<string, string>) =>
  queryOptions({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(
        api.project({ id: projectId }).files.get(headers ? { headers } : undefined)
      );
      return res;
    },
  });

export const getChatHistoryQueryOptions = (projectId: string, headers?: Record<string, string>) =>
  queryOptions({
    queryKey: ["project-chat", projectId],
    queryFn: async () => {
      // @ts-ignore
      const res = await apiCall(
        api.project({ id: projectId }).chat.get(headers ? { headers } : undefined)
      );
      return res;
    },
  });
