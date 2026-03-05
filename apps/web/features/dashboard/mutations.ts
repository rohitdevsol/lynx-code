import { api, apiCall } from "@/lib/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitializeProjectFromPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { name: string; description: string; template?: "react" | "nextjs" | "vue" | "blank"; prompt: string }) => {
      const payload = {
        name: vars.name,
        description: vars.description,
        template: vars.template || "react",
        prompt: vars.prompt
      };

      const res = await apiCall(api.ai["initialize-from-prompt"].post(payload));
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project initialized successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to initialize project");
    },
  });
};

export const useCreateEmptyProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { name: string; description: string; template?: "react" | "nextjs" | "vue" | "blank" }) => {
      const res = await apiCall(api.project.post(vars));
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
};
