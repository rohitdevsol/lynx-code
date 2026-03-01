import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getProjectsQueryOptions } from "@/features/dashboard/queries";
import { DashboardClient } from "./dashboard-client";
import { getSSRApiHeaders } from "@/lib/eden-ssr";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const headers = await getSSRApiHeaders();
  await queryClient.prefetchQuery(getProjectsQueryOptions(headers));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
