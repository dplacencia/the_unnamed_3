import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import { InfoCircleIcon } from "@/icons";
import { useLocale } from "next-intl";

const es = {
  active: "Prueba de Inventario activa",
  activeDescription: "El acceso depende de los permisos de cada persona.",
  trialEnds: "Fin de la prueba",
  paused: "Acceso a Inventario pausado",
  pausedDescription:
    "La prueba ha terminado. Las consultas y los cambios de Inventario están pausados.",
  unavailable: "No se ha podido consultar el acceso a Inventario",
  unavailableDescription: "Vuelve a consultarlo más tarde.",
};

const messages: Record<Locale, typeof es> = {
  es,
  en: {
    active: "Inventory trial active",
    activeDescription: "Access depends on each person’s permissions.",
    trialEnds: "Trial ends",
    paused: "Inventory access paused",
    pausedDescription:
      "The trial has ended. Inventory reads and changes are paused.",
    unavailable: "We couldn’t check Inventory access",
    unavailableDescription: "Check again later.",
  },
  ca: {
    active: "Prova d’Inventari activa",
    activeDescription: "L’accés depèn dels permisos de cada persona.",
    trialEnds: "Fi de la prova",
    paused: "Accés a Inventari en pausa",
    pausedDescription:
      "La prova s’ha acabat. Les consultes i els canvis d’Inventari estan en pausa.",
    unavailable: "No s’ha pogut consultar l’accés a Inventari",
    unavailableDescription: "Consulta-ho més endavant.",
  },
  gl: {
    active: "Proba de Inventario activa",
    activeDescription: "O acceso depende dos permisos de cada persoa.",
    trialEnds: "Fin da proba",
    paused: "Acceso a Inventario en pausa",
    pausedDescription:
      "A proba rematou. As consultas e os cambios de Inventario están en pausa.",
    unavailable: "Non se puido consultar o acceso a Inventario",
    unavailableDescription: "Volve consultalo máis tarde.",
  },
  eu: {
    active: "Inbentarioaren proba aktibo",
    activeDescription: "Sarbidea pertsona bakoitzaren baimenen araberakoa da.",
    trialEnds: "Probaren amaiera",
    paused: "Inbentariorako sarbidea etenda",
    pausedDescription:
      "Proba amaitu da. Inbentarioko kontsultak eta aldaketak etenda daude.",
    unavailable: "Ezin izan da Inbentariorako sarbidea kontsultatu",
    unavailableDescription: "Kontsultatu berriro geroago.",
  },
};

export type MerchantInventoryAccessPhase = "active" | "paused" | "unavailable";

export function MerchantInventoryAccess({
  phase,
  trialEndsAt,
}: {
  phase: MerchantInventoryAccessPhase;
  trialEndsAt?: string;
}) {
  const language = useLocale();
  const locale = isLocale(language) ? language : defaultLocale;
  const copy = messages[locale];
  const trialEnd =
    phase === "active" &&
    trialEndsAt &&
    Number.isFinite(Date.parse(trialEndsAt))
      ? new Intl.DateTimeFormat(locale, {
          dateStyle: "long",
          timeStyle: "long",
          timeZone: "UTC",
        }).format(new Date(trialEndsAt))
      : null;

  return (
    <Alert
      variant={phase === "active" ? "default" : "warning"}
      role="status"
      data-merchant-inventory-access={phase}
    >
      <InfoCircleIcon aria-hidden="true" />
      <AlertTitle>{copy[phase]}</AlertTitle>
      <AlertDescription>
        <p>{copy[`${phase}Description`]}</p>
        {trialEnd && (
          <p>
            {copy.trialEnds} · <time dateTime={trialEndsAt}>{trialEnd}</time>
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
