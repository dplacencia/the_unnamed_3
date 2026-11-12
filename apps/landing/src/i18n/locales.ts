export const locales = ["es", "en", "ca", "gl", "eu"] as const;
export const defaultLocale = "es";
export type Locale = (typeof locales)[number];
