"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { MoonIcon, SunIcon } from "@/icons";
import { useTranslations } from "next-intl";

export default function ThemeToggleButton() {
  const t = useTranslations("header");
  const { toggleTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon-lg"
      className="relative"
      aria-label={t("toggleTheme")}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
