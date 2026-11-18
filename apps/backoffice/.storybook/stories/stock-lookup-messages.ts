import type { Locale } from "@/i18n/configuration";
import { receiptMessages } from "./stock-receipt-messages";

const es = {
  viewStock: "Ver existencias",
  recorded: "Existencias registradas",
  pickPair: "Selecciona un producto y una ubicación.",
  pickProduct: "Selecciona un producto.",
  pickLocation: "Selecciona una ubicación.",
  loading: "Consultando las existencias…",
  noRecord:
    "No hay un registro de existencias para este producto en esta ubicación.",
  denied: "No tienes acceso a las existencias de esta ubicación.",
  invalid: "No se pueden consultar las existencias para esta selección.",
  error: "No se han podido consultar las existencias.",
  previous: "Resultado anterior",
  refresh: "Actualizar",
};

const localized: Record<Locale, typeof es> = {
  es,
  en: {
    viewStock: "View stock",
    recorded: "Recorded stock",
    pickPair: "Select a product and a location.",
    pickProduct: "Select a product.",
    pickLocation: "Select a location.",
    loading: "Checking stock…",
    noRecord: "There is no stock record for this product at this location.",
    denied: "You don’t have access to stock at this location.",
    invalid: "Stock cannot be checked for this selection.",
    error: "Stock could not be retrieved.",
    previous: "Previous result",
    refresh: "Refresh",
  },
  ca: {
    viewStock: "Mostra les existències",
    recorded: "Existències registrades",
    pickPair: "Selecciona un producte i una ubicació.",
    pickProduct: "Selecciona un producte.",
    pickLocation: "Selecciona una ubicació.",
    loading: "S’estan consultant les existències…",
    noRecord:
      "No hi ha cap registre d’existències per a aquest producte en aquesta ubicació.",
    denied: "No tens accés a les existències d’aquesta ubicació.",
    invalid: "No es poden consultar les existències per a aquesta selecció.",
    error: "No s’han pogut consultar les existències.",
    previous: "Resultat anterior",
    refresh: "Actualitza",
  },
  gl: {
    viewStock: "Ver existencias",
    recorded: "Existencias rexistradas",
    pickPair: "Selecciona un produto e unha localización.",
    pickProduct: "Selecciona un produto.",
    pickLocation: "Selecciona unha localización.",
    loading: "Consultando as existencias…",
    noRecord:
      "Non hai un rexistro de existencias para este produto nesta localización.",
    denied: "Non tes acceso ás existencias desta localización.",
    invalid: "Non se poden consultar as existencias para esta selección.",
    error: "Non se puideron consultar as existencias.",
    previous: "Resultado anterior",
    refresh: "Actualizar",
  },
  eu: {
    viewStock: "Ikusi izakinak",
    recorded: "Erregistratutako izakinak",
    pickPair: "Hautatu produktu bat eta kokapen bat.",
    pickProduct: "Hautatu produktu bat.",
    pickLocation: "Hautatu kokapen bat.",
    loading: "Izakinak kontsultatzen…",
    noRecord: "Ez dago produktu honen izakinen erregistrorik kokapen honetan.",
    denied: "Ez duzu kokapen honetako izakinak ikusteko baimenik.",
    invalid: "Ezin dira hautapen honetako izakinak kontsultatu.",
    error: "Ezin izan dira izakinak kontsultatu.",
    previous: "Aurreko emaitza",
    refresh: "Eguneratu",
  },
};

export function lookupMessages(locale: Locale) {
  const { product, productId, searchProduct, noProducts, retry, pieceSymbol } =
    receiptMessages[locale];
  return {
    ...localized[locale],
    product,
    productId,
    searchProduct,
    noProducts,
    retry,
    pieceSymbol,
  };
}
