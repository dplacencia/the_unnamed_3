import type { Locale } from "../src/i18n/configuration";
import es from "./messages/es.json";
import en from "./messages/en.json";
import ca from "./messages/ca.json";
import gl from "./messages/gl.json";
import eu from "./messages/eu.json";

type CatalogueMessages = Record<keyof typeof es, string>;
export const catalogueMessages: Record<Locale, CatalogueMessages> = {
  es,
  en,
  ca,
  gl,
  eu,
};
