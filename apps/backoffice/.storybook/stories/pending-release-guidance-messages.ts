import type { Locale } from "@/i18n/configuration";

const es = {
  reviewChannel: "Revisar canal",
  confirmRelease: "Confirmar liberación",
  registeredQuantity: "Cantidad registrada",
  indicatedChannel: "Canal indicado",
  channelLabel: "Canal de la salida",
  fixChannelHint: "Selecciona el canal por el que salió el producto.",
  confirmChannel: "He comprobado el canal de esta salida.",
  recordedReason: "Motivo registrado",
};

export const pendingReleaseGuidanceMessages: Record<Locale, typeof es> = {
  es,
  en: {
    reviewChannel: "Review channel",
    confirmRelease: "Confirm release",
    registeredQuantity: "Recorded quantity",
    indicatedChannel: "Channel you provided",
    channelLabel: "Departure channel",
    fixChannelHint: "Select the channel used for this departure.",
    confirmChannel: "I’ve checked the channel for this departure.",
    recordedReason: "Recorded reason",
  },
  ca: {
    reviewChannel: "Revisa el canal",
    confirmRelease: "Confirma l’alliberament",
    registeredQuantity: "Quantitat registrada",
    indicatedChannel: "Canal indicat",
    channelLabel: "Canal de la sortida",
    fixChannelHint: "Tria el canal pel qual va sortir el producte.",
    confirmChannel: "He comprovat el canal d’aquesta sortida.",
    recordedReason: "Motiu registrat",
  },
  gl: {
    reviewChannel: "Revisar a canle",
    confirmRelease: "Confirmar a liberación",
    registeredQuantity: "Cantidade rexistrada",
    indicatedChannel: "Canle indicada",
    channelLabel: "Canle da saída",
    fixChannelHint: "Escolle a canle pola que saíu o produto.",
    confirmChannel: "Comprobei a canle desta saída.",
    recordedReason: "Motivo rexistrado",
  },
  eu: {
    reviewChannel: "Berrikusi kanala",
    confirmRelease: "Berretsi askapena",
    registeredQuantity: "Erregistratutako kopurua",
    indicatedChannel: "Adierazitako kanala",
    channelLabel: "Irteeraren kanala",
    fixChannelHint: "Hautatu produktuaren irteerarako erabili zen kanala.",
    confirmChannel: "Irteera honen kanala egiaztatu dut.",
    recordedReason: "Erregistratutako arrazoia",
  },
};
