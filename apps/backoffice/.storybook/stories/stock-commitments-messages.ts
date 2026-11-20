import type { Locale } from "@/i18n/configuration";
import { pendingDepartureInspectionMessages } from "./pending-departure-inspection-messages";
import { receiptMessages } from "./stock-receipt-messages";

function message(es: string, en: string, ca: string, gl: string, eu: string) {
  return { es, en, ca, gl, eu };
}

const labels = {
  reserve: message(
    "Reservar existencias",
    "Reserve stock",
    "Reservar estoc",
    "Reservar existencias",
    "Stocka erreserbatu",
  ),
  inspect: message(
    "Consultar reserva",
    "Look up reservation",
    "Consultar reserva",
    "Consultar reserva",
    "Erreserba kontsultatu",
  ),
  details: message(
    "Reserva de existencias",
    "Stock reservation",
    "Reserva d’estoc",
    "Reserva de existencias",
    "Stock-erreserba",
  ),
  reference: message(
    "Referencia de la reserva",
    "Reservation reference",
    "Referència de la reserva",
    "Referencia da reserva",
    "Erreserbaren erreferentzia",
  ),
  quantity: message(
    "Cantidad",
    "Quantity",
    "Quantitat",
    "Cantidade",
    "Kopurua",
  ),
  onHand: message(
    "Existencias registradas",
    "Recorded stock",
    "Estoc registrat",
    "Existencias rexistradas",
    "Erregistratutako stocka",
  ),
  available: message(
    "Disponible en el canal",
    "Available in this channel",
    "Disponible al canal",
    "Dispoñible na canle",
    "Kanalean erabilgarri",
  ),
  allowPartial: message(
    "Aceptar una cantidad menor si no se puede reservar toda",
    "Accept less if the full amount cannot be reserved",
    "Acceptar una quantitat inferior si no es pot reservar tota",
    "Aceptar unha cantidade menor se non se pode reservar toda",
    "Onartu kopuru txikiagoa guztia erreserbatu ezin bada",
  ),
  accepted: message(
    "Cantidad reservada al inicio",
    "Originally reserved",
    "Quantitat reservada inicialment",
    "Cantidade reservada ao inicio",
    "Hasieran erreserbatutako kopurua",
  ),
  unaccepted: message(
    "Cantidad que no se pudo reservar",
    "Quantity not reserved",
    "Quantitat que no s’ha pogut reservar",
    "Cantidade que non se puido reservar",
    "Erreserbatu ezin izan den kopurua",
  ),
  outstanding: message(
    "Pendiente de entregar",
    "Still to deliver",
    "Pendent de lliurar",
    "Pendente de entregar",
    "Entregatzeko geratzen dena",
  ),
  fulfilled: message(
    "Cantidad entregada",
    "Delivered quantity",
    "Quantitat lliurada",
    "Cantidade entregada",
    "Entregatutako kopurua",
  ),
  expiry: message(
    "Vencimiento de la reserva",
    "Reservation expiry",
    "Venciment de la reserva",
    "Vencemento da reserva",
    "Erreserbaren iraungipena",
  ),
  release: message(
    "Liberar reserva",
    "Release reservation",
    "Alliberar reserva",
    "Liberar reserva",
    "Erreserba askatu",
  ),
  releaseQuestion: message(
    "¿Liberar la cantidad pendiente?",
    "Release the outstanding quantity?",
    "Vols alliberar la quantitat pendent?",
    "Liberar a cantidade pendente?",
    "Geratzen den kopurua askatu?",
  ),
  releaseDescription: message(
    "Las unidades ya entregadas conservan su salida registrada.",
    "Already delivered units retain their recorded stock departure.",
    "Les unitats ja lliurades conserven la sortida registrada.",
    "As unidades xa entregadas conservan a saída rexistrada.",
    "Dagoeneko entregatutako unitateek stock-irteera erregistratua mantentzen dute.",
  ),
  fulfill: message(
    "Registrar entrega",
    "Record delivery",
    "Registrar lliurament",
    "Rexistrar entrega",
    "Entrega erregistratu",
  ),
  fulfillmentQuantity: message(
    "Cantidad entregada",
    "Delivered quantity",
    "Quantitat lliurada",
    "Cantidade entregada",
    "Entregatutako kopurua",
  ),
  remainder: message(
    "¿Qué quieres hacer con lo que queda?",
    "What should happen to the remainder?",
    "Què vols fer amb la quantitat restant?",
    "Que queres facer co que queda?",
    "Zer egin nahi duzu geratzen denarekin?",
  ),
  keepRemainder: message(
    "Mantener la reserva y su vencimiento",
    "Keep the reservation and its expiry",
    "Mantenir la reserva i el venciment",
    "Manter a reserva e o vencemento",
    "Mantendu erreserba eta iraungipena",
  ),
  releaseRemainder: message(
    "Liberar lo que queda",
    "Release the remainder",
    "Alliberar la quantitat restant",
    "Liberar o que queda",
    "Askatu geratzen dena",
  ),
  chooseRemainder: message(
    "Elige qué hacer con la cantidad que queda.",
    "Choose what should happen to the remaining quantity.",
    "Tria què cal fer amb la quantitat restant.",
    "Escolle que facer coa cantidade que queda.",
    "Aukeratu geratzen den kopuruarekin zer egin.",
  ),
  reserved: message(
    "Reserva registrada",
    "Reservation recorded",
    "Reserva registrada",
    "Reserva rexistrada",
    "Erreserba erregistratuta",
  ),
  released: message(
    "Reserva liberada",
    "Reservation released",
    "Reserva alliberada",
    "Reserva liberada",
    "Erreserba askatuta",
  ),
  fulfilledStatus: message(
    "Reserva entregada",
    "Reservation fulfilled",
    "Reserva lliurada",
    "Reserva entregada",
    "Erreserba entregatuta",
  ),
  active: message(
    "Reserva activa",
    "Active reservation",
    "Reserva activa",
    "Reserva activa",
    "Erreserba aktiboa",
  ),
  delivery: message(
    "Entrega registrada",
    "Delivery recorded",
    "Lliurament registrat",
    "Entrega rexistrada",
    "Entrega erregistratuta",
  ),
  effect: message(
    "Cambio en las existencias",
    "Physical stock change",
    "Canvi en l’estoc",
    "Cambio nas existencias",
    "Stock fisikoaren aldaketa",
  ),
  releasedQuantity: message(
    "Cantidad liberada",
    "Released quantity",
    "Quantitat alliberada",
    "Cantidade liberada",
    "Askatutako kopurua",
  ),
  wholeQuantity: message(
    "Introduce un número entero mayor que cero.",
    "Enter a whole number greater than zero.",
    "Introdueix un nombre enter més gran que zero.",
    "Introduce un número enteiro maior ca cero.",
    "Sartu zero baino handiagoa den zenbaki osoa.",
  ),
  excess: message(
    "Esta vista de ejemplo admite entregas de hasta la cantidad pendiente.",
    "This preview supports delivery up to the outstanding quantity.",
    "Aquesta vista d’exemple admet lliuraments fins a la quantitat pendent.",
    "Esta vista de exemplo admite entregas ata a cantidade pendente.",
    "Aurrebista honek geratzen den kopurura arteko entregak onartzen ditu.",
  ),
  noFixture: message(
    "Esta combinación no tiene un resultado en la vista de ejemplo.",
    "This combination has no result in the preview.",
    "Aquesta combinació no té resultat a la vista d’exemple.",
    "Esta combinación non ten resultado na vista de exemplo.",
    "Konbinazio horrek ez du emaitzarik aurrebistan.",
  ),
  declined: message(
    "No se ha podido reservar toda la cantidad solicitada.",
    "The full requested quantity could not be reserved.",
    "No s’ha pogut reservar tota la quantitat sol·licitada.",
    "Non se puido reservar toda a cantidade solicitada.",
    "Ezin izan da eskatutako kopuru osoa erreserbatu.",
  ),
  unconfirmed: message(
    "No hemos podido confirmar el resultado de la operación.",
    "We couldn’t confirm the operation’s outcome.",
    "No hem pogut confirmar el resultat de l’operació.",
    "Non puidemos confirmar o resultado da operación.",
    "Ezin izan dugu eragiketaren emaitza baieztatu.",
  ),
  viewAttempt: message(
    "Ver operación",
    "View operation",
    "Veure operació",
    "Ver operación",
    "Ikusi eragiketa",
  ),
  unavailable: message(
    "No se puede consultar esta reserva.",
    "This reservation is unavailable.",
    "No es pot consultar aquesta reserva.",
    "Non se pode consultar esta reserva.",
    "Ezin da erreserba hau kontsultatu.",
  ),
  readError: message(
    "No hemos podido consultar la reserva.",
    "We couldn’t look up the reservation.",
    "No hem pogut consultar la reserva.",
    "Non puidemos consultar a reserva.",
    "Ezin izan dugu erreserba kontsultatu.",
  ),
  cancel: message("Cancelar", "Cancel", "Cancel·lar", "Cancelar", "Utzi"),
  close: message("Cerrar", "Close", "Tancar", "Pechar", "Itxi"),
  retryRead: message(
    "Reintentar consulta",
    "Retry lookup",
    "Tornar a consultar",
    "Volver consultar",
    "Saiatu berriro kontsultatzen",
  ),
  refreshRead: message(
    "Actualizar",
    "Refresh",
    "Actualitzar",
    "Actualizar",
    "Eguneratu",
  ),
  back: message(
    "Volver a la reserva",
    "Back to reservation",
    "Tornar a la reserva",
    "Volver á reserva",
    "Itzuli erreserbara",
  ),
};
type Copy = { [Key in keyof typeof labels]: string };

export function stockCommitmentsMessages(locale: Locale) {
  const departure = pendingDepartureInspectionMessages(locale);
  const receipt = receiptMessages[locale];
  const localized = {} as Copy;
  for (const label of Object.keys(labels) as (keyof Copy)[]) {
    localized[label] = labels[label][locale];
  }
  return {
    ...localized,
    product: receipt.product,
    location: departure.location,
    channel: departure.channel,
    unitSymbol: receipt.pieceSymbol,
  };
}
