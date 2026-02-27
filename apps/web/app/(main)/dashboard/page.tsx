import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getProjectsQueryOptions } from "@/features/dashboard/queries";
import { DashboardClient } from "./dashboard-client";

import { headers } from "next/headers";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const reqHeaders = await headers();
  const cookieHeader = reqHeaders.get("cookie");

  // Prefetch data on the server
  await queryClient.prefetchQuery(
    getProjectsQueryOptions(cookieHeader ? { cookie: cookieHeader } : undefined)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
