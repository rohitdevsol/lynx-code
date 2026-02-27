import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { requireAuth } from "@/lib/auth-utils";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <JotaiProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="flex-1 overflow-hidden relative min-h-screen bg-black text-white">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="text-zinc-400 hover:text-white transition-colors glass-panel p-2 rounded-md bg-zinc-900/40" />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </JotaiProvider>
  );
}
