import type { Locale } from "./configuration";

export interface Language {
  id: Locale;
  name: string;
  dir: "ltr" | "rtl";
}

export const languages: Language[] = [
  { id: "es", name: "Español", dir: "ltr" },
  { id: "en", name: "English", dir: "ltr" },
  { id: "ca", name: "Català", dir: "ltr" },
  { id: "gl", name: "Galego", dir: "ltr" },
  { id: "eu", name: "Euskara", dir: "ltr" },
];

export function getLanguage(locale: Locale): Language {
  return languages.find((language) => language.id === locale) ?? languages[0];
}

export function isRtl(locale: Locale): boolean {
  return getLanguage(locale).dir === "rtl";
}
