import type { Locale } from "@/i18n/configuration";

const es = {
  title: "Primeros pasos",
  newSiteHint:
    "Crea un centro con su primera área, por ejemplo una tienda con un almacén.",
  oneAreaHint: "Configura una ubicación de stock en esta área.",
  chooseArea: "Elegir área",
  chooseAreaHint:
    "Elige el área donde quieres configurar la ubicación de stock.",
  noActiveAreaHint:
    "Hace falta un área activa para configurar una ubicación de stock.",
  checkSetup: "Revisar configuración",
  checkSetupHint:
    "Revisa las ubicaciones de stock en Configuración del inventario.",
  productHint: "Añade un producto para registrar sus movimientos.",
  receiptHint: "Registra la cantidad que ha llegado y dónde la has recibido.",
  channelHint:
    "Crea un canal, como la venta en tienda, para registrar salidas.",
  enableHint:
    "Habilita el canal en la ubicación desde la que saldrán las existencias.",
  departureHint: "Registra qué producto ha salido, cuánto y desde dónde.",
  coreHint:
    "Puedes seguir usando los ajustes del comercio a los que tengas acceso.",
};

export const ownerFirstUseMessages: Record<Locale, typeof es> = {
  es,
  en: {
    title: "Getting started",
    newSiteHint:
      "Create a site and its first area, for example a shop with a stockroom.",
    oneAreaHint: "Set up a stock location in this area.",
    chooseArea: "Choose area",
    chooseAreaHint:
      "Choose the area where you want to set up the stock location.",
    noActiveAreaHint: "You need an active area to set up a stock location.",
    checkSetup: "Review setup",
    checkSetupHint: "Review stock locations in Inventory settings.",
    productHint: "Add a product so you can record its stock movements.",
    receiptHint: "Record how much arrived and where you received it.",
    channelHint:
      "Create a channel, such as in-store sales, to record departures.",
    enableHint: "Enable the channel at the location stock will leave from.",
    departureHint:
      "Record which product left, how much and from which location.",
    coreHint: "You can still use the business settings you have access to.",
  },
  ca: {
    title: "Primers passos",
    newSiteHint:
      "Crea un centre amb la seva primera àrea, per exemple una botiga amb un magatzem.",
    oneAreaHint: "Configura una ubicació d’estoc en aquesta àrea.",
    chooseArea: "Tria una àrea",
    chooseAreaHint: "Tria l’àrea on vols configurar la ubicació d’estoc.",
    noActiveAreaHint:
      "Cal una àrea activa per configurar una ubicació d’estoc.",
    checkSetup: "Revisa la configuració",
    checkSetupHint:
      "Revisa les ubicacions d’estoc a Configuració de l’inventari.",
    productHint: "Afegeix un producte per registrar-ne els moviments.",
    receiptHint: "Registra la quantitat que ha arribat i on l’has rebut.",
    channelHint:
      "Crea un canal, com ara la venda a la botiga, per registrar sortides.",
    enableHint:
      "Habilita el canal a la ubicació d’on sortiran les existències.",
    departureHint:
      "Registra quin producte ha sortit, en quina quantitat i d’on.",
    coreHint:
      "Pots continuar fent servir les opcions del comerç a què tinguis accés.",
  },
  gl: {
    title: "Primeiros pasos",
    newSiteHint:
      "Crea un centro coa súa primeira área, por exemplo unha tenda cun almacén.",
    oneAreaHint: "Configura unha localización de stock nesta área.",
    chooseArea: "Escoller área",
    chooseAreaHint:
      "Escolle a área onde queres configurar a localización de stock.",
    noActiveAreaHint:
      "Fai falta unha área activa para configurar unha localización de stock.",
    checkSetup: "Revisar a configuración",
    checkSetupHint:
      "Revisa as localizacións de stock en Configuración do inventario.",
    productHint: "Engade un produto para rexistrar os seus movementos.",
    receiptHint: "Rexistra a cantidade que chegou e onde a recibiches.",
    channelHint:
      "Crea unha canle, como a venda na tenda, para rexistrar saídas.",
    enableHint: "Activa a canle na localización da que sairán as existencias.",
    departureHint: "Rexistra que produto saíu, en que cantidade e de onde.",
    coreHint: "Podes seguir usando as opcións do comercio ás que teñas acceso.",
  },
  eu: {
    title: "Lehen urratsak",
    newSiteHint:
      "Sortu zentro bat eta haren lehen eremua, adibidez denda bat eta haren biltegia.",
    oneAreaHint: "Konfiguratu stock-kokaleku bat eremu honetan.",
    chooseArea: "Aukeratu eremua",
    chooseAreaHint: "Aukeratu stock-kokalekua konfiguratu nahi duzun eremua.",
    noActiveAreaHint:
      "Stock-kokalekua konfiguratzeko, eremu aktibo bat behar da.",
    checkSetup: "Berrikusi konfigurazioa",
    checkSetupHint:
      "Berrikusi stock-kokalekuak Inbentarioaren ezarpenak atalean.",
    productHint: "Gehitu produktu bat haren mugimenduak erregistratzeko.",
    receiptHint: "Erregistratu zenbat iritsi den eta non jaso duzun.",
    channelHint:
      "Sortu kanal bat irteerak erregistratzeko, adibidez dendako salmentarako.",
    enableHint: "Gaitu kanala izakinak aterako diren kokalekuan.",
    departureHint:
      "Erregistratu zein produktu atera den, zenbat eta zein kokalekutatik.",
    coreHint:
      "Saltokiaren ezarpenak erabiltzen jarrai dezakezu, sarbidea baduzu.",
  },
};
