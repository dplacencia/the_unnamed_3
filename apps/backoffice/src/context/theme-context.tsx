"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";

type ThemeContextType = {
  theme: ResolvedTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const colorSchemeQuery = "(prefers-color-scheme: dark)";
const serverMode = (): ThemeMode => "light";
const serverDark = () => false;
const clientHydrated = () => true;
const noSubscription = () => () => {};

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "auto";
}

function createThemeStore() {
  let mode: ThemeMode | undefined;
  const listeners = new Set<() => void>();

  return {
    getSnapshot(): ThemeMode {
      if (mode) return mode;
      try {
        const saved = localStorage.getItem("theme-mode");
        const legacy = localStorage.getItem("theme");
        mode = isThemeMode(saved)
          ? saved
          : legacy === "dark"
            ? "dark"
            : "light";
      } catch {
        mode = "light";
      }
      return mode;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setMode(next: ThemeMode) {
      mode = next;
      listeners.forEach((listener) => listener());
    },
  };
}

function systemIsDark() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia(colorSchemeQuery).matches
  );
}

function subscribeSystemTheme(listener: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(colorSchemeQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store] = useState(createThemeStore);
  const themeMode = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    serverMode,
  );
  const dark = useSyncExternalStore(
    subscribeSystemTheme,
    systemIsDark,
    serverDark,
  );
  const hydrated = useSyncExternalStore(
    noSubscription,
    clientHydrated,
    serverDark,
  );
  const theme: ResolvedTheme =
    themeMode === "auto" ? (dark ? "dark" : "light") : themeMode;

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("theme-mode", themeMode);
      localStorage.setItem("theme", theme);
    } catch {
      // The in-memory preference remains usable when browser storage is blocked.
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-color-scheme", theme);
  }, [hydrated, theme, themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode: store.setMode,
        toggleTheme: () => store.setMode(theme === "light" ? "dark" : "light"),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
