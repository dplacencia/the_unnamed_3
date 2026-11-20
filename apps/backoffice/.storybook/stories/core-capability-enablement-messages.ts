import type { Locale } from "@/i18n/configuration";

function message(es: string, en: string, ca: string, gl: string, eu: string) {
  return { es, en, ca, gl, eu };
}

const messages = {
  inventory: message(
    "Inventario",
    "Inventory",
    "Inventari",
    "Inventario",
    "Inbentarioa",
  ),
  catalogue: message(
    "Catálogo",
    "Catalogue",
    "Catàleg",
    "Catálogo",
    "Katalogoa",
  ),
  stock: message("Existencias", "Stock", "Estoc", "Existencias", "Stocka"),
  pricing: message("Precios", "Pricing", "Preus", "Prezos", "Prezioak"),
  catalogueDescription: message(
    "Gestiona los productos del negocio.",
    "Manage the business’s products.",
    "Gestiona els productes del negoci.",
    "Xestiona os produtos do negocio.",
    "Kudeatu negozioaren produktuak.",
  ),
  stockDescription: message(
    "Registra y consulta las existencias de cada ubicación.",
    "Record and look up stock at each location.",
    "Registra i consulta l’estoc de cada ubicació.",
    "Rexistra e consulta as existencias de cada localización.",
    "Erregistratu eta kontsultatu kokaleku bakoitzeko stocka.",
  ),
  pricingDescription: message(
    "Requiere Catálogo.",
    "Requires Catalogue.",
    "Requereix Catàleg.",
    "Require Catálogo.",
    "Katalogoa behar du.",
  ),
  active: message("Activado", "Enabled", "Activat", "Activado", "Gaituta"),
  inactive: message(
    "Desactivado",
    "Disabled",
    "Desactivat",
    "Desactivado",
    "Desgaituta",
  ),
  activate: message("Activar", "Enable", "Activar", "Activar", "Gaitu"),
  deactivate: message(
    "Desactivar",
    "Disable",
    "Desactivar",
    "Desactivar",
    "Desgaitu",
  ),
  activateAction: message(
    "Activar {name}",
    "Enable {name}",
    "Activar {name}",
    "Activar {name}",
    "Gaitu {name}",
  ),
  deactivateAction: message(
    "Desactivar {name}",
    "Disable {name}",
    "Desactivar {name}",
    "Desactivar {name}",
    "Desgaitu {name}",
  ),
  activated: message(
    "Se ha activado {name}.",
    "{name} is now enabled.",
    "S’ha activat {name}.",
    "Activouse {name}.",
    "{name} gaituta dago.",
  ),
  deactivated: message(
    "Se ha desactivado {name}.",
    "{name} is now disabled.",
    "S’ha desactivat {name}.",
    "Desactivouse {name}.",
    "{name} desgaituta dago.",
  ),
  missingTitle: message(
    "No se ha podido activar Precios.",
    "Pricing could not be enabled.",
    "No s’ha pogut activar Preus.",
    "Non se puido activar Prezos.",
    "Ezin izan dira prezioak gaitu.",
  ),
  requiresCatalogue: message(
    "Activa Catálogo para poder activar Precios.",
    "Enable Catalogue before enabling Pricing.",
    "Activa Catàleg per poder activar Preus.",
    "Activa Catálogo para poder activar Prezos.",
    "Gaitu Katalogoa Prezioak gaitu ahal izateko.",
  ),
  dependentTitle: message(
    "No se ha podido desactivar Catálogo.",
    "Catalogue could not be disabled.",
    "No s’ha pogut desactivar Catàleg.",
    "Non se puido desactivar Catálogo.",
    "Ezin izan da Katalogoa desgaitu.",
  ),
  usedByPricing: message(
    "Precios está activado y necesita Catálogo.",
    "Pricing is enabled and requires Catalogue.",
    "Preus està activat i necessita Catàleg.",
    "Prezos está activado e necesita Catálogo.",
    "Prezioak gaituta dago eta Katalogoa behar du.",
  ),
  providerTitle: message(
    "Servicio de Inventario no disponible.",
    "Inventory service unavailable.",
    "Servei d’Inventari no disponible.",
    "Servizo de Inventario non dispoñible.",
    "Inbentario-zerbitzua ez dago erabilgarri.",
  ),
  providerDescription: message(
    "Las operaciones de Catálogo y Existencias que requieren Inventario están temporalmente fuera de servicio.",
    "Catalogue and Stock operations that need Inventory are temporarily unavailable.",
    "Les operacions de Catàleg i Estoc que necessiten Inventari no estan disponibles temporalment.",
    "As operacións de Catálogo e Existencias que precisan Inventario están temporalmente fóra de servizo.",
    "Inbentarioa behar duten Katalogoaren eta Stockaren eragiketak ez daude erabilgarri aldi baterako.",
  ),
  managementUnavailable: message(
    "No se ha podido comprobar el permiso para hacer cambios.",
    "Permission to make changes could not be checked.",
    "No s’ha pogut comprovar el permís per fer canvis.",
    "Non se puido comprobar o permiso para facer cambios.",
    "Ezin izan da aldaketak egiteko baimena egiaztatu.",
  ),
  lastConfirmed: message(
    "Última configuración confirmada",
    "Last confirmed configuration",
    "Última configuració confirmada",
    "Última configuración confirmada",
    "Baieztatutako azken konfigurazioa",
  ),
  readOnly: message(
    "Puedes consultar la configuración.",
    "You can view the configuration.",
    "Pots consultar la configuració.",
    "Podes consultar a configuración.",
    "Konfigurazioa kontsulta dezakezu.",
  ),
};

export function capabilityEnablementMessages(locale: Locale) {
  return (key: keyof typeof messages, name = "") =>
    messages[key][locale].replace("{name}", name);
}
