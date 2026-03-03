import { ProjectWorkspaceClient } from "./project-workspace-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getProjectFilesQueryOptions, getChatHistoryQueryOptions } from "@/features/workspace/queries";
import { getSSRApiHeaders } from "@/lib/eden-ssr";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const queryClient = getQueryClient();
  const headers = await getSSRApiHeaders();

  await Promise.all([
    queryClient.prefetchQuery(getProjectFilesQueryOptions(projectId, headers)),
    queryClient.prefetchQuery(getChatHistoryQueryOptions(projectId, headers))
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectWorkspaceClient projectId={projectId} />
    </HydrationBoundary>
  );
}
