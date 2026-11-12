import type { Preview } from "@storybook/nextjs-vite";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { ThemeProvider, useTheme } from "../src/context/theme-context";
import {
  defaultLocale,
  isLocale,
  type Locale,
} from "../src/i18n/configuration";
import { languages } from "../src/i18n/languages";
import es from "../src/messages/es.json";
import en from "../src/messages/en.json";
import ca from "../src/messages/ca.json";
import gl from "../src/messages/gl.json";
import eu from "../src/messages/eu.json";
import { catalogueMessages } from "./catalogue-messages";
import "./preview.css";

const messages = { es, en, ca, gl, eu };

function Appearance({ theme }: { theme: "light" | "dark" }) {
  const { setThemeMode } = useTheme();
  useEffect(() => setThemeMode(theme), [theme, setThemeMode]);
  return null;
}

function Providers({
  children,
  locale,
  theme,
  fullscreen,
}: {
  children: ReactNode;
  locale: Locale;
  theme: "light" | "dark";
  fullscreen: boolean;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{ ...messages[locale], catalogue: catalogueMessages[locale] }}
    >
      <ThemeProvider>
        <Appearance theme={theme} />
        <DirectionProvider direction="ltr">
          <TooltipProvider>
            <main data-visual-stage data-fullscreen={String(fullscreen)}>
              {children}
            </main>
          </TooltipProvider>
        </DirectionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
    controls: { expanded: true },
    viewport: {
      options: {
        desktop: {
          name: "Escritorio 1440",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
        tablet: {
          name: "Tableta 768",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        mobile: {
          name: "Móvil 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Apariencia de la muestra",
      toolbar: {
        title: "Apariencia",
        icon: "circlehollow",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Oscuro" },
        ],
      },
    },
    locale: {
      description: "Idioma de los ejemplos",
      toolbar: {
        title: "Idioma",
        icon: "globe",
        dynamicTitle: true,
        items: languages.map(({ id, name }) => ({ value: id, title: name })),
      },
    },
  },
  initialGlobals: { theme: "light", locale: defaultLocale },
  decorators: [
    (Story, context) => (
      <Providers
        locale={
          isLocale(context.globals.locale)
            ? context.globals.locale
            : defaultLocale
        }
        theme={context.globals.theme === "dark" ? "dark" : "light"}
        fullscreen={context.parameters.visual?.fullscreen === true}
      >
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
