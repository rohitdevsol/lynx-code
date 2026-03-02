import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { getHomeDataQueryOptions, getUserProfileQueryOptions } from "@/features/home/queries";
import { HomeClient } from "./home-client";
import { getSSRApiHeaders } from "@/lib/eden-ssr";

export default async function HomePage() {
  const queryClient = getQueryClient();
  const headers = await getSSRApiHeaders();

  // Prefetch data on the server
  await Promise.all([
    queryClient.prefetchQuery(getHomeDataQueryOptions(headers)),
    queryClient.prefetchQuery(getUserProfileQueryOptions(headers)),
  ]);

  const userProfile = queryClient.getQueryData<any>(getUserProfileQueryOptions(headers).queryKey);
  const realName = userProfile?.profile?.name || "";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient realName={realName} />
    </HydrationBoundary>
  );
}
