import type { Locale } from "@/i18n/configuration";

const es = {
  pendingOriginalNoEffect:
    "Al registrar esta entrada, las existencias no cambiaron.",
  uncertaintyTitle: "No hemos podido confirmar el resultado de esta entrada.",
  sameReceiptRetry: "Reintentar la misma entrada",
  readRetry: "Reintentar consulta",
};

export const receiptFeedbackMessages: Record<Locale, typeof es> = {
  es,
  en: {
    pendingOriginalNoEffect:
      "Stock did not change when this receipt was recorded.",
    uncertaintyTitle: "We couldn’t confirm the outcome of this receipt.",
    sameReceiptRetry: "Retry the same receipt",
    readRetry: "Retry lookup",
  },
  ca: {
    pendingOriginalNoEffect:
      "En registrar aquesta entrada, les existències no van canviar.",
    uncertaintyTitle: "No hem pogut confirmar el resultat d’aquesta entrada.",
    sameReceiptRetry: "Torna a provar amb la mateixa entrada",
    readRetry: "Torna a fer la consulta",
  },
  gl: {
    pendingOriginalNoEffect:
      "Ao rexistrar esta entrada, as existencias non cambiaron.",
    uncertaintyTitle: "Non puidemos confirmar o resultado desta entrada.",
    sameReceiptRetry: "Volver tentar a mesma entrada",
    readRetry: "Volver facer a consulta",
  },
  eu: {
    pendingOriginalNoEffect:
      "Sarrera hau erregistratzean, izakinak ez ziren aldatu.",
    uncertaintyTitle: "Ezin izan dugu sarrera honen emaitza baieztatu.",
    sameReceiptRetry: "Saiatu berriro sarrera berarekin",
    readRetry: "Saiatu berriro kontsultatzen",
  },
};
