import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme-context";
import { defaultLocale } from "@/i18n/configuration";
import { LocaleProvider } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} dir="ltr">
      <body
        className={cn("relative isolate dark:bg-gray-900", outfit.className)}
      >
        <LocaleProvider>
          <ThemeProvider>
            <DirectionProvider direction="ltr">
              <TooltipProvider>{children}</TooltipProvider>
            </DirectionProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
