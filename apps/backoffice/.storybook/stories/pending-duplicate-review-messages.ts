import type { Locale } from "@/i18n/configuration";

const es = {
  reviewDuplicate: "Revisar duplicado",
  affectedLines: "Líneas que se cancelarán",
  reason: "Motivo de la cancelación",
  confirm: "Confirmar cancelación",
  cancelled: "Lote cancelado",
  kept: "Lote conservado",
};

export const pendingDuplicateReviewMessages: Record<Locale, typeof es> = {
  es,
  en: {
    reviewDuplicate: "Review duplicate",
    affectedLines: "Lines to cancel",
    reason: "Cancellation reason",
    confirm: "Confirm cancellation",
    cancelled: "Cancelled batch",
    kept: "Retained batch",
  },
  ca: {
    reviewDuplicate: "Revisa el duplicat",
    affectedLines: "Línies que es cancel·laran",
    reason: "Motiu de la cancel·lació",
    confirm: "Confirma la cancel·lació",
    cancelled: "Lot cancel·lat",
    kept: "Lot conservat",
  },
  gl: {
    reviewDuplicate: "Revisar o duplicado",
    affectedLines: "Liñas que se cancelarán",
    reason: "Motivo da cancelación",
    confirm: "Confirmar a cancelación",
    cancelled: "Lote cancelado",
    kept: "Lote conservado",
  },
  eu: {
    reviewDuplicate: "Berrikusi lote bikoiztua",
    affectedLines: "Baliogabetuko diren lerroak",
    reason: "Baliogabetzearen arrazoia",
    confirm: "Berretsi baliogabetzea",
    cancelled: "Baliogabetutako lotea",
    kept: "Mantendutako lotea",
  },
};
