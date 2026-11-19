import type { Locale } from "@/i18n/configuration";
import { receiptMessages } from "./stock-receipt-messages";

const es = {
  title: "Estado actual",
  originalResult: "Resultado al registrar la entrada",
  open: "Ver detalles",
  back: "Volver a la entrada",
  refresh: "Actualizar",
  loading: "Consultando los detalles de la entrada…",
  unavailable: "No se pueden consultar los detalles de esta entrada",
  error: "No se ha podido consultar el estado de esta entrada.",
  savedQuantity: "Cantidad registrada",
  unknown: "Sin determinar",
  reasons: "Motivos por los que quedó pendiente",
  fixtureReasons: [
    "El producto ya no estaba activo.",
    "La cantidad recibida no se ajustaba a las reglas de medición.",
    "No se pudo identificar el producto.",
    "No se pudo determinar la unidad de medida.",
  ],
  fixtureRejectedReason: "La entrega ya estaba registrada en otra entrada.",
};

const localized: Record<Locale, typeof es> = {
  es,
  en: {
    title: "Current status",
    originalResult: "Result when the receipt was recorded",
    open: "View details",
    back: "Back to receipt",
    refresh: "Refresh",
    loading: "Checking receipt details…",
    unavailable: "Details for this receipt are unavailable",
    error: "The receipt status could not be retrieved.",
    savedQuantity: "Recorded quantity",
    unknown: "Undetermined",
    reasons: "Reasons the receipt was marked pending",
    fixtureReasons: [
      "The product was no longer active.",
      "The received quantity did not fit the measurement rules.",
      "The product could not be identified.",
      "The unit of measure could not be determined.",
    ],
    fixtureRejectedReason:
      "The delivery was already recorded in another receipt.",
  },
  ca: {
    title: "Estat actual",
    originalResult: "Resultat en registrar l’entrada",
    open: "Mostra els detalls",
    back: "Torna a l’entrada",
    refresh: "Actualitza",
    loading: "S’estan consultant els detalls de l’entrada…",
    unavailable: "No es poden consultar els detalls d’aquesta entrada",
    error: "No s’ha pogut consultar l’estat d’aquesta entrada.",
    savedQuantity: "Quantitat registrada",
    unknown: "Sense determinar",
    reasons: "Motius pels quals va quedar pendent",
    fixtureReasons: [
      "El producte ja no estava actiu.",
      "La quantitat rebuda no s’ajustava a les regles de mesura.",
      "No es va poder identificar el producte.",
      "No es va poder determinar la unitat de mesura.",
    ],
    fixtureRejectedReason:
      "El lliurament ja estava registrat en una altra entrada.",
  },
  gl: {
    title: "Estado actual",
    originalResult: "Resultado ao rexistrar a entrada",
    open: "Ver detalles",
    back: "Volver á entrada",
    refresh: "Actualizar",
    loading: "Consultando os detalles da entrada…",
    unavailable: "Non se poden consultar os detalles desta entrada",
    error: "Non se puido consultar o estado desta entrada.",
    savedQuantity: "Cantidade rexistrada",
    unknown: "Sen determinar",
    reasons: "Motivos polos que quedou pendente",
    fixtureReasons: [
      "O produto xa non estaba activo.",
      "A cantidade recibida non se axustaba ás regras de medida.",
      "Non se puido identificar o produto.",
      "Non se puido determinar a unidade de medida.",
    ],
    fixtureRejectedReason: "A entrega xa estaba rexistrada noutra entrada.",
  },
  eu: {
    title: "Uneko egoera",
    originalResult: "Sarrera erregistratzean jasotako emaitza",
    open: "Ikusi xehetasunak",
    back: "Itzuli sarrerara",
    refresh: "Eguneratu",
    loading: "Sarreraren xehetasunak kontsultatzen…",
    unavailable: "Ezin dira sarrera honen xehetasunak kontsultatu",
    error: "Ezin izan da sarrera honen egoera kontsultatu.",
    savedQuantity: "Erregistratutako kopurua",
    unknown: "Zehaztu gabe",
    reasons: "Sarrera zain geratu izanaren arrazoiak",
    fixtureReasons: [
      "Produktua jada ez zegoen aktibo.",
      "Jasotako kopurua ez zetorren bat neurketa-arauekin.",
      "Ezin izan zen produktua identifikatu.",
      "Ezin izan zen neurri-unitatea zehaztu.",
    ],
    fixtureRejectedReason:
      "Entrega beste sarrera batean erregistratuta zegoen.",
  },
};

export function pendingInspectionMessages(locale: Locale) {
  const {
    applied,
    appliedQuantity,
    destination,
    pending,
    pieceSymbol,
    product,
    rejected,
    retry,
    unit,
  } = receiptMessages[locale];
  return {
    ...localized[locale],
    applied,
    appliedQuantity,
    location: destination,
    pending,
    pieceSymbol,
    product,
    rejected,
    retry,
    unit,
  };
}

const fixtureReasonCodes = [
  "product-archived",
  "quantity-rules",
  "product-unresolved",
  "unit-unresolved",
];

export function pendingInspectionReason(locale: Locale, reason: string) {
  const { fixtureReasons, fixtureRejectedReason } = localized[locale];
  if (reason === "duplicate-entry") return fixtureRejectedReason;
  return fixtureReasons[fixtureReasonCodes.indexOf(reason)] ?? reason;
}
