import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getHomeDataQueryOptions } from "@/features/home/queries";
import { HomeClient } from "./home-client";

import { headers } from "next/headers";

export default async function HomePage() {
  const queryClient = getQueryClient();
  const reqHeaders = await headers();
  const cookieHeader = reqHeaders.get("cookie");

  // Prefetch data on the server
  await queryClient.prefetchQuery(
    getHomeDataQueryOptions(cookieHeader ? { cookie: cookieHeader } : undefined)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}
