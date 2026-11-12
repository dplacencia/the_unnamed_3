"use client";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import AppSidebarHeader from "./sidebar-header";

export default function AppSidebar() {
  const { open, isMobile, isHovered } = useSidebar();

  return (
    <Sidebar side="left" collapsible="icon">
      <AppSidebarHeader showContent={open || isHovered || isMobile} />
      <SidebarContent className="px-5" />
    </Sidebar>
  );
}
