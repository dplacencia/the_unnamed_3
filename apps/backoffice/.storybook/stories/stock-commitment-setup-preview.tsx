import { useState, type FormEvent, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultLocale, isLocale, type Locale } from "@/i18n/configuration";
import { NavigationPrototype } from "./navigation-prototype";
import {
  authorizedCommitmentScopes,
  commitmentScopeFor,
  holdPolicy,
  type CommitmentScope,
} from "./stock-commitments-model";
import { stockCommitmentsMessages } from "./stock-commitments-messages";
import { StockCommitmentsPreview } from "./stock-commitments-preview";

const messages = {
  es: [
    "Elige dónde reservar",
    "Selecciona una opción",
    "Continuar",
    "Configurar reservas",
    "Configuración de referencia",
    "Valores del centro",
    "Excepción de la ubicación",
    "Máximo por reserva",
    "Máximo activo total",
    "Sin límite de cantidad",
    "Duración máxima inicial en minutos",
    "Vigencia total máxima en minutos",
    "Prórrogas",
    "No permitir",
    "Permitir",
    "Duración máxima por prórroga en minutos",
    "Número máximo de prórrogas por reserva",
    "Guardar configuración",
    "Configuración guardada para",
  ],
  en: [
    "Choose where to reserve stock",
    "Select an option",
    "Continue",
    "Configure reservations",
    "Configuration scope",
    "Site settings",
    "Location override",
    "Maximum per reservation",
    "Maximum total active",
    "No quantity limit",
    "Maximum initial duration in minutes",
    "Maximum lifetime in minutes",
    "Extensions",
    "Disallow",
    "Allow",
    "Maximum minutes per extension",
    "Maximum extensions per reservation",
    "Save settings",
    "Settings saved for",
  ],
  ca: [
    "Tria on vols reservar estoc",
    "Selecciona una opció",
    "Continua",
    "Configura les reserves",
    "Àmbit de la configuració",
    "Valors del centre",
    "Excepció de la ubicació",
    "Màxim per reserva",
    "Màxim actiu total",
    "Sense límit de quantitat",
    "Durada inicial màxima en minuts",
    "Vigència total màxima en minuts",
    "Pròrrogues",
    "No permetis",
    "Permet",
    "Durada màxima per pròrroga en minuts",
    "Nombre màxim de pròrrogues per reserva",
    "Desa la configuració",
    "Configuració desada per a",
  ],
  gl: [
    "Escolle onde reservar existencias",
    "Selecciona unha opción",
    "Continuar",
    "Configurar reservas",
    "Ámbito da configuración",
    "Valores do centro",
    "Excepción da localización",
    "Máximo por reserva",
    "Máximo activo total",
    "Sen límite de cantidade",
    "Duración inicial máxima en minutos",
    "Vixencia total máxima en minutos",
    "Prórrogas",
    "Non permitir",
    "Permitir",
    "Duración máxima por prórroga en minutos",
    "Número máximo de prórrogas por reserva",
    "Gardar a configuración",
    "Configuración gardada para",
  ],
  eu: [
    "Aukeratu non erreserbatu stocka",
    "Hautatu aukera bat",
    "Jarraitu",
    "Konfiguratu erreserbak",
    "Konfigurazioaren eremua",
    "Zentroaren balioak",
    "Kokalekuaren salbuespena",
    "Erreserba bakoitzeko gehienekoa",
    "Guztizko gehieneko aktiboa",
    "Kopuru-mugarik gabe",
    "Hasierako gehieneko iraupena minututan",
    "Gehieneko indarraldia minututan",
    "Luzapenak",
    "Ez baimendu",
    "Baimendu",
    "Luzapen bakoitzeko gehieneko iraupena minututan",
    "Erreserba bakoitzeko gehieneko luzapen kopurua",
    "Gorde konfigurazioa",
    "Konfigurazioa gordeta honetarako",
  ],
} satisfies Record<
  Locale,
  readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
>;

function useSetupLocale() {
  const locale = useLocale();
  return isLocale(locale) ? locale : defaultLocale;
}

const selectClass =
  "min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

function Choice({
  label,
  value,
  prompt,
  options,
  change,
}: {
  label: string;
  value: string;
  prompt: string;
  options: ReadonlyArray<readonly [string, string]>;
  change(value: string): void;
}) {
  return (
    <label className="grid gap-1 font-medium">
      {label}
      <select
        className={selectClass}
        value={value}
        disabled={!options.length}
        onChange={(event) => change(event.target.value)}
      >
        <option value="">{prompt}</option>
        {options.map(([id, title]) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReviewForm({
  title,
  marker,
  children,
  submit,
}: {
  title: string;
  marker: "select-scope" | "hold-settings";
  children: ReactNode;
  submit(event: FormEvent<HTMLFormElement>): void;
}) {
  return (
    <form
      className="grid max-w-xl gap-4 rounded-lg border border-gray-200 bg-white p-4 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
      onSubmit={submit}
      data-stock-commitments-ready={marker}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </form>
  );
}

export function CommitmentScopePreview() {
  const locale = useSetupLocale();
  const copy = stockCommitmentsMessages(locale);
  const [heading, prompt, proceed] = messages[locale];
  const [product, setProduct] = useState("");
  const [location, setLocation] = useState("");
  const [channel, setChannel] = useState("");
  const [selected, setSelected] = useState<CommitmentScope>();
  const productScopes = authorizedCommitmentScopes.filter(
    (scope) => scope.product.id === product,
  );
  const available = commitmentScopeFor(product, location, channel);
  if (selected)
    return (
      <StockCommitmentsPreview fixture="reserve" selectedScope={selected} />
    );
  return (
    <NavigationPrototype
      initialPage="movements"
      permissionMode="ready"
      locationCount="several"
      movementsContent={
        <ReviewForm
          title={heading}
          marker="select-scope"
          submit={(event) => {
            event.preventDefault();
            if (available) setSelected(available);
          }}
        >
          <Choice
            label={copy.product}
            value={product}
            prompt={prompt}
            options={authorizedCommitmentScopes.map(({ product }) => [
              product.id,
              product.name,
            ])}
            change={(value) => {
              setProduct(value);
              setLocation("");
              setChannel("");
            }}
          />
          <Choice
            label={copy.location}
            value={location}
            prompt={prompt}
            options={productScopes.map(({ location }) => [
              location.id,
              location.name,
            ])}
            change={(value) => {
              setLocation(value);
              setChannel("");
            }}
          />
          <Choice
            label={copy.channel}
            value={channel}
            prompt={prompt}
            options={productScopes
              .filter((scope) => scope.location.id === location)
              .map(({ channel }) => [channel.id, channel.name])}
            change={setChannel}
          />
          <Button
            type="submit"
            className="justify-self-start"
            disabled={!available}
          >
            {proceed}
          </Button>
        </ReviewForm>
      }
    />
  );
}

const blankPolicy: Parameters<typeof holdPolicy>[0] = {
  perHold: "",
  total: "",
  duration: "",
  lifetime: "",
  extensions: "",
  extensionDuration: "",
  extensionCount: "",
};

export function HoldSettingsPreview() {
  const locale = useSetupLocale();
  const copy = stockCommitmentsMessages(locale);
  const [
    ,
    prompt,
    ,
    heading,
    scopeLabel,
    site,
    location,
    perHold,
    total,
    unlimited,
    duration,
    lifetime,
    extensions,
    disallow,
    allow,
    extensionDuration,
    extensionCount,
    save,
    saved,
  ] = messages[locale];
  const [target, setTarget] = useState("");
  const [draft, setDraft] = useState(blankPolicy);
  const [established, setEstablished] = useState("");
  const policy = holdPolicy(draft);
  const scopeOptions = [
    ["site", `${site} · Tienda Centro`],
    ["location", `${location} · Almacén`],
  ] as const;

  function setValue<Key extends keyof typeof blankPolicy>(
    key: Key,
    value: (typeof blankPolicy)[Key],
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }

  function numeric(
    key: Exclude<keyof typeof blankPolicy, "extensions">,
    label: string,
    allowUnlimited = false,
  ) {
    return (
      <div className="grid gap-1">
        <label className="grid gap-1 font-medium">
          {label}
          <Input
            inputMode="numeric"
            value={draft[key] === "unlimited" ? "" : draft[key]}
            disabled={draft[key] === "unlimited"}
            onChange={(event) => setValue(key, event.target.value)}
          />
        </label>
        {allowUnlimited && (
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={draft[key] === "unlimited"}
              onChange={(event) =>
                setValue(key, event.target.checked ? "unlimited" : "")
              }
            />
            {unlimited}
          </label>
        )}
      </div>
    );
  }

  return (
    <NavigationPrototype
      initialPage="inventory-settings"
      permissionMode="ready"
      locationCount="several"
      inventorySettingsContent={
        <ReviewForm
          title={heading}
          marker="hold-settings"
          submit={(event) => {
            event.preventDefault();
            if (policy && target) setEstablished(target);
          }}
        >
          <p>{copy.product} · Caja de cartón</p>
          <Choice
            label={scopeLabel}
            value={target}
            prompt={prompt}
            options={scopeOptions}
            change={(value) => {
              setTarget(value);
              setDraft(blankPolicy);
            }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {numeric("perHold", perHold, true)}
            {numeric("total", total, true)}
            {numeric("duration", duration)}
            {numeric("lifetime", lifetime)}
          </div>
          <Choice
            label={extensions}
            value={draft.extensions}
            prompt={prompt}
            options={[
              ["disabled", disallow],
              ["enabled", allow],
            ]}
            change={(value) =>
              setValue(
                "extensions",
                value === "enabled" || value === "disabled" ? value : "",
              )
            }
          />
          {draft.extensions === "enabled" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {numeric("extensionDuration", extensionDuration)}
              {numeric("extensionCount", extensionCount)}
            </div>
          )}
          <Button
            type="submit"
            className="justify-self-start"
            disabled={!target || !policy}
          >
            {save}
          </Button>
          {established && (
            <p role="status">
              {saved} {scopeOptions.find(([id]) => id === established)?.[1]}.
            </p>
          )}
        </ReviewForm>
      }
    />
  );
}
