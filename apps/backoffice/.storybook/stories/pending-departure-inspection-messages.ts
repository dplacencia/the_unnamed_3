import type { Locale } from "@/i18n/configuration";
import {
  pendingInspectionMessages,
  pendingInspectionReason,
} from "./pending-receipt-inspection-messages";

const es = {
  heading: "Detalles de la salida",
  back: "Volver a Pendientes",
  location: "Ubicación de origen",
  channel: "Canal",
  pending: "Salida pendiente",
  applied: "Salida aplicada",
  rejected: "Salida rechazada",
  appliedQuantity: "Cambio aplicado al stock",
  loading: "Consultando los detalles de la salida…",
  unavailable: "No se pueden consultar los detalles de esta salida",
  error: "No se ha podido consultar el estado de esta salida.",
  reasons: "Motivos por los que quedó pendiente",
  quantityRulesReason: "La cantidad no se ajustaba a las reglas de medición.",
  quantityMissingReason: "No se indicó la cantidad.",
  channelMissingReason: "No se indicó el canal de la salida.",
  channelNotEnabledReason: "El canal no estaba habilitado en esta ubicación.",
  duplicateBatchCancelledReason: "Se canceló el lote duplicado.",
};

const localized: Record<Locale, typeof es> = {
  es,
  en: {
    heading: "Departure details",
    back: "Back to pending movements",
    location: "Origin location",
    channel: "Channel",
    pending: "Departure pending",
    applied: "Departure applied",
    rejected: "Departure rejected",
    appliedQuantity: "Applied stock change",
    loading: "Checking departure details…",
    unavailable: "Details for this departure are unavailable",
    error: "The departure status could not be retrieved.",
    reasons: "Reasons the departure was marked pending",
    quantityRulesReason: "The quantity did not fit the measurement rules.",
    quantityMissingReason: "No quantity was specified.",
    channelMissingReason: "No channel was specified for the departure.",
    channelNotEnabledReason: "The channel was not enabled at this location.",
    duplicateBatchCancelledReason: "The duplicate batch was cancelled.",
  },
  ca: {
    heading: "Detalls de la sortida",
    back: "Torna a Pendents",
    location: "Ubicació d’origen",
    channel: "Canal",
    pending: "Sortida pendent",
    applied: "Sortida aplicada",
    rejected: "Sortida rebutjada",
    appliedQuantity: "Canvi aplicat a l’estoc",
    loading: "S’estan consultant els detalls de la sortida…",
    unavailable: "No es poden consultar els detalls d’aquesta sortida",
    error: "No s’ha pogut consultar l’estat d’aquesta sortida.",
    reasons: "Motius pels quals va quedar pendent",
    quantityRulesReason: "La quantitat no s’ajustava a les regles de mesura.",
    quantityMissingReason: "No es va indicar la quantitat.",
    channelMissingReason: "No es va indicar el canal de la sortida.",
    channelNotEnabledReason:
      "El canal no estava habilitat en aquesta ubicació.",
    duplicateBatchCancelledReason: "Es va cancel·lar el lot duplicat.",
  },
  gl: {
    heading: "Detalles da saída",
    back: "Volver a Pendentes",
    location: "Localización de orixe",
    channel: "Canle",
    pending: "Saída pendente",
    applied: "Saída aplicada",
    rejected: "Saída rexeitada",
    appliedQuantity: "Cambio aplicado ás existencias",
    loading: "Consultando os detalles da saída…",
    unavailable: "Non se poden consultar os detalles desta saída",
    error: "Non se puido consultar o estado desta saída.",
    reasons: "Motivos polos que quedou pendente",
    quantityRulesReason: "A cantidade non se axustaba ás regras de medida.",
    quantityMissingReason: "Non se indicou a cantidade.",
    channelMissingReason: "Non se indicou a canle da saída.",
    channelNotEnabledReason:
      "A canle non estaba habilitada nesta localización.",
    duplicateBatchCancelledReason: "Cancelouse o lote duplicado.",
  },
  eu: {
    heading: "Irteeraren xehetasunak",
    back: "Itzuli zain dauden mugimenduetara",
    location: "Jatorrizko kokalekua",
    channel: "Kanala",
    pending: "Irteera zain",
    applied: "Irteera aplikatuta",
    rejected: "Irteera baztertuta",
    appliedQuantity: "Izakinei aplikatutako aldaketa",
    loading: "Irteeraren xehetasunak kontsultatzen…",
    unavailable: "Ezin dira irteera honen xehetasunak kontsultatu",
    error: "Ezin izan da irteera honen egoera kontsultatu.",
    reasons: "Irteera zain geratu izanaren arrazoiak",
    quantityRulesReason: "Kopurua ez zetorren bat neurketa-arauekin.",
    quantityMissingReason: "Ez zen kopurua adierazi.",
    channelMissingReason: "Ez zen irteeraren kanala adierazi.",
    channelNotEnabledReason: "Kanala ez zegoen gaituta kokaleku honetan.",
    duplicateBatchCancelledReason: "Lote bikoiztua baliogabetu zen.",
  },
};

export function pendingDepartureInspectionMessages(locale: Locale) {
  return { ...pendingInspectionMessages(locale), ...localized[locale] };
}

export function pendingDepartureInspectionReason(
  locale: Locale,
  reason: string,
) {
  const copy = localized[locale];
  switch (reason) {
    case "quantity-rules":
      return copy.quantityRulesReason;
    case "quantity-missing":
      return copy.quantityMissingReason;
    case "channel-missing":
      return copy.channelMissingReason;
    case "channel-not-enabled":
      return copy.channelNotEnabledReason;
    case "duplicate-batch-cancelled":
      return copy.duplicateBatchCancelledReason;
    default:
      return pendingInspectionReason(locale, reason);
  }
}
