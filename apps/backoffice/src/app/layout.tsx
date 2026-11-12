import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme-context";
import { defaultLocale } from "@/i18n/configuration";
import { LocaleProvider } from "@/i18n/locale-provider";
import { cn } from "@/utils";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import localFont from "next/font/local";
import "./globals.css";

const sourceSans3 = localFont({
  src: "../assets/fonts/source-sans-3.ttf",
  style: "normal",
  weight: "200 900",
  display: "swap",
  variable: "--font-source-sans-3",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} dir="ltr">
      <body
        className={cn(
          "relative isolate dark:bg-gray-900",
          sourceSans3.variable,
        )}
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
