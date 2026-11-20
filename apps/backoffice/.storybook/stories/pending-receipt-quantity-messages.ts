import type { Locale } from "@/i18n/configuration";

const es = {
  reviewQuantity: "Revisar cantidad",
  indicatedQuantity: "Cantidad indicada",
  quantityRule:
    "Introduce una cantidad mayor que cero y menor que {original}, en múltiplos de {increment}.",
  invalidQuantity: "La cantidad no cumple las reglas indicadas.",
};

export const pendingReceiptQuantityMessages: Record<Locale, typeof es> = {
  es,
  en: {
    reviewQuantity: "Review quantity",
    indicatedQuantity: "Quantity you provided",
    quantityRule:
      "Enter a quantity greater than zero and less than {original}, in multiples of {increment}.",
    invalidQuantity: "The quantity doesn’t meet the rules shown here.",
  },
  ca: {
    reviewQuantity: "Revisa la quantitat",
    indicatedQuantity: "Quantitat indicada",
    quantityRule:
      "Introdueix una quantitat superior a zero i inferior a {original}, en múltiples de {increment}.",
    invalidQuantity: "La quantitat no compleix les regles indicades.",
  },
  gl: {
    reviewQuantity: "Revisar a cantidade",
    indicatedQuantity: "Cantidade indicada",
    quantityRule:
      "Introduce unha cantidade maior ca cero e menor ca {original}, en múltiplos de {increment}.",
    invalidQuantity: "A cantidade non cumpre as regras indicadas.",
  },
  eu: {
    reviewQuantity: "Berrikusi kopurua",
    indicatedQuantity: "Adierazitako kopurua",
    quantityRule:
      "Sartu {increment} kopuruaren multiplo bat, zero baino handiagoa eta {original} baino txikiagoa.",
    invalidQuantity: "Kopuruak ez ditu adierazitako arauak betetzen.",
  },
};
