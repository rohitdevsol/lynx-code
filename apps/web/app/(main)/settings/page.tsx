import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsClient />
    </HydrationBoundary>
  );
}
