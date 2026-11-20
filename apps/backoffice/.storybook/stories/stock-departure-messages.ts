import type { Locale } from "@/i18n/configuration";
import { pendingDepartureInspectionMessages } from "./pending-departure-inspection-messages";
import { receiptMessages } from "./stock-receipt-messages";

const es = {
  title: "Registrar salida",
  panelDescription:
    "Registra la salida de un producto desde una ubicación de stock.",
  quantity: "Cantidad que sale",
  quantityRequired: "Introduce la cantidad que sale.",
  locationRequired: "Selecciona la ubicación de origen.",
  reference: "Referencia de salida (opcional)",
  selectChannel: "Selecciona un canal",
  originFirst: "Selecciona primero la ubicación de origen.",
  noChannels: "No hay canales habilitados en esta ubicación.",
  submitting: "Registrando la salida…",
  unconfirmed: "Salida sin confirmar",
  rejectedReason:
    "La ubicación de origen indicada no está disponible para esta salida.",
};

const localized: Record<Locale, typeof es> = {
  es,
  en: {
    title: "Record departure",
    panelDescription: "Record one product leaving a stock location.",
    quantity: "Quantity leaving",
    quantityRequired: "Enter the quantity leaving.",
    locationRequired: "Select the origin location.",
    reference: "Departure reference (optional)",
    selectChannel: "Select a channel",
    originFirst: "Select the origin location first.",
    noChannels: "There are no enabled channels at this location.",
    submitting: "Recording the departure…",
    unconfirmed: "Departure unconfirmed",
    rejectedReason: "The selected origin is unavailable for this departure.",
  },
  ca: {
    title: "Registrar sortida",
    panelDescription:
      "Registra la sortida d’un producte des d’una ubicació d’estoc.",
    quantity: "Quantitat que surt",
    quantityRequired: "Introdueix la quantitat que surt.",
    locationRequired: "Selecciona la ubicació d’origen.",
    reference: "Referència de sortida (opcional)",
    selectChannel: "Selecciona un canal",
    originFirst: "Selecciona primer la ubicació d’origen.",
    noChannels: "No hi ha canals habilitats en aquesta ubicació.",
    submitting: "S’està registrant la sortida…",
    unconfirmed: "Sortida sense confirmar",
    rejectedReason:
      "La ubicació d’origen indicada no està disponible per a aquesta sortida.",
  },
  gl: {
    title: "Rexistrar saída",
    panelDescription:
      "Rexistra a saída dun produto desde unha localización de existencias.",
    quantity: "Cantidade que sae",
    quantityRequired: "Introduce a cantidade que sae.",
    locationRequired: "Selecciona a localización de orixe.",
    reference: "Referencia de saída (opcional)",
    selectChannel: "Selecciona unha canle",
    originFirst: "Selecciona primeiro a localización de orixe.",
    noChannels: "Non hai canles habilitadas nesta localización.",
    submitting: "Rexistrando a saída…",
    unconfirmed: "Saída sen confirmar",
    rejectedReason:
      "A localización de orixe indicada non está dispoñible para esta saída.",
  },
  eu: {
    title: "Irteera erregistratu",
    panelDescription:
      "Erregistratu produktu bat stock-kokaleku batetik ateratzen denean.",
    quantity: "Irteerako kopurua",
    quantityRequired: "Sartu irteerako kopurua.",
    locationRequired: "Hautatu jatorrizko kokalekua.",
    reference: "Irteeraren erreferentzia (aukerakoa)",
    selectChannel: "Hautatu kanal bat",
    originFirst: "Hautatu lehenik jatorrizko kokalekua.",
    noChannels: "Ez dago gaitutako kanalik kokaleku honetan.",
    submitting: "Irteera erregistratzen…",
    unconfirmed: "Irteera baieztatu gabe",
    rejectedReason:
      "Hautatutako jatorria ez dago erabilgarri irteera honetarako.",
  },
};

export function stockDepartureMessages(locale: Locale) {
  const receipt = receiptMessages[locale];
  const departure = localized[locale];
  const inspection = pendingDepartureInspectionMessages(locale);
  return {
    ...receipt,
    ...departure,
    open: departure.title,
    submit: departure.title,
    destination: inspection.location,
    channel: inspection.channel,
    applied: inspection.applied,
    pending: inspection.pending,
    rejected: inspection.rejected,
    appliedQuantity: inspection.appliedQuantity,
    errors: {
      ...receipt.errors,
      location: departure.locationRequired,
      quantityRequired: departure.quantityRequired,
    },
  };
}
