"use client";

import { Home, LayoutDashboard, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Account",
    url: "#",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="inset" className="border-r border-white/5 bg-black">
      <div className="p-4 flex items-center space-x-2 border-b border-white/5 h-16">
        <Image src="/logo.svg" alt="Logo" width={28} height={28} />
        {!isMobile && (
          <span className="text-white font-semibold flex items-center gap-2">
            Lynx Code
          </span>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 mb-2">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url) && item.url !== "#";
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link
                        href={item.url}
                        className={`transition-colors duration-200 hover:text-white ${
                          isActive
                            ? "bg-zinc-900 text-white font-medium"
                            : "text-zinc-400"
                        }`}
                      >
                        <item.icon className="!h-4 !w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
