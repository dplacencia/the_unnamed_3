"use client";

import { NextIntlClientProvider } from "next-intl";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import ca from "@/messages/ca.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import eu from "@/messages/eu.json";
import gl from "@/messages/gl.json";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "./configuration";

const messages = { es, en, ca, gl, eu };
const serverLocale = () => null;
const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => boolean;
} | null>(null);

function readPreference(): Locale {
  try {
    const value = document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.slice(LOCALE_COOKIE_NAME.length + 1);
    return isLocale(value) ? value : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

function writePreference(locale: Locale): boolean {
  try {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
    return document.cookie
      .split(";")
      .some((cookie) => cookie.trim() === `${LOCALE_COOKIE_NAME}=${locale}`);
  } catch {
    return false;
  }
}

function createLocaleStore() {
  let locale: Locale | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot(): Locale {
      locale ??= readPreference();
      return locale;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setLocale(next: Locale): boolean {
      if (!isLocale(next)) return false;
      locale = next;
      const persisted = writePreference(next);
      listeners.forEach((listener) => listener());
      return persisted;
    },
  };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createLocaleStore);
  const locale = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    serverLocale,
  );

  useEffect(() => {
    if (locale) document.documentElement.lang = locale;
  }, [locale]);

  if (!locale) return <div role="status" aria-busy="true" />;

  return (
    <LocaleContext.Provider value={{ locale, setLocale: store.setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocalePreference() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocalePreference requires LocaleProvider");
  return context;
}
