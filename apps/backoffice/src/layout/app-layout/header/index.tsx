"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuTwoIcon, XIcon } from "@/icons";
import ThemeToggleButton from "@/layout/header/theme-toggler";
import { useTranslations } from "next-intl";

export default function AppHeader() {
  const t = useTranslations("header");
  const { openMobile, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex w-full shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex w-full items-center justify-between gap-4 px-3 py-3 xl:px-6 xl:py-4">
        <Button
          variant="outline"
          size="icon"
          className="text-gray-500 lg:size-11 dark:text-gray-400"
          onClick={toggleSidebar}
          aria-label={t("toggleSidebar")}
        >
          {openMobile ? (
            <XIcon className="size-6" />
          ) : (
            <MenuTwoIcon className="size-auto! rtl:-scale-x-100" />
          )}
        </Button>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
