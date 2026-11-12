"use client";

import { SidebarHeader } from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";

interface AppSidebarHeaderProps {
  showContent: boolean;
}

export default function AppSidebarHeader({
  showContent,
}: AppSidebarHeaderProps) {
  return (
    <SidebarHeader className="p-5">
      <Link
        href="/"
        className={cn(
          "flex items-center",
          !showContent ? "justify-center" : "justify-start",
        )}
      >
        <span
          className={cn(
            "font-semibold tracking-[-0.04em] whitespace-nowrap text-gray-900 dark:text-white",
            showContent ? "text-[32px] leading-10" : "text-xl leading-8",
          )}
        >
          Irin
        </span>
      </Link>
    </SidebarHeader>
  );
}
