import { api, apiCall } from "@/lib/eden";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMountSandbox = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      // @ts-ignore
      return await apiCall(api.project({ id: projectId }).sandbox.post());
    },
    onError: (error) => {
      toast.error("Failed to mount sandbox: " + error.message);
    }
  });
};

export const useSyncFile = () => {
  return useMutation({
    mutationFn: async (params: { projectId: string; filePath: string; content: string }) => {
      // @ts-ignore
      return await apiCall(api.project({ id: params.projectId }).files.sync.post({ filePath: params.filePath, content: params.content }));
    },
    onError: (error) => {
      toast.error("Failed to sync file: " + error.message);
    }
  });
};

export const useExecCommand = () => {
  return useMutation({
    mutationFn: async (params: { projectId: string; command: string }) => {
      // @ts-ignore
      return await apiCall(api.project({ id: params.projectId }).sandbox.exec.post({ command: params.command }));
    },
    onError: (error) => {
      toast.error("Failed to execute command: " + error.message);
    }
  });
};
