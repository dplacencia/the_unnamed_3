import type { Locale } from "@/i18n/configuration";

const es = {
  stockEffectLabel: "Cambio en existencias",
  originalOutcomeLabel: "Resultado al registrar la salida",
  pendingOriginalNoEffect:
    "Al registrar esta salida, las existencias no cambiaron.",
  uncertaintyTitle: "No hemos podido confirmar el resultado de esta salida.",
  sameDepartureRetry: "Reintentar la misma salida",
};

export const departureFeedbackMessages: Record<Locale, typeof es> = {
  es,
  en: {
    stockEffectLabel: "Stock change",
    originalOutcomeLabel: "Result when the departure was recorded",
    pendingOriginalNoEffect:
      "Stock did not change when this departure was recorded.",
    uncertaintyTitle: "We couldn’t confirm the outcome of this departure.",
    sameDepartureRetry: "Retry the same departure",
  },
  ca: {
    stockEffectLabel: "Canvi en les existències",
    originalOutcomeLabel: "Resultat en registrar la sortida",
    pendingOriginalNoEffect:
      "En registrar aquesta sortida, les existències no van canviar.",
    uncertaintyTitle: "No hem pogut confirmar el resultat d’aquesta sortida.",
    sameDepartureRetry: "Torna a provar amb la mateixa sortida",
  },
  gl: {
    stockEffectLabel: "Cambio nas existencias",
    originalOutcomeLabel: "Resultado ao rexistrar a saída",
    pendingOriginalNoEffect:
      "Ao rexistrar esta saída, as existencias non cambiaron.",
    uncertaintyTitle: "Non puidemos confirmar o resultado desta saída.",
    sameDepartureRetry: "Volver tentar a mesma saída",
  },
  eu: {
    stockEffectLabel: "Izakin-aldaketa",
    originalOutcomeLabel: "Irteera erregistratzean jasotako emaitza",
    pendingOriginalNoEffect:
      "Irteera hau erregistratzean, izakinak ez ziren aldatu.",
    uncertaintyTitle: "Ezin izan dugu irteera honen emaitza baieztatu.",
    sameDepartureRetry: "Saiatu berriro irteera berarekin",
  },
};
