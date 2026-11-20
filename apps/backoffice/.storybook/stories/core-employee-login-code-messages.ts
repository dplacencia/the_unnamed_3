import type { Locale } from "@/i18n/configuration";

const es = {
  title: "Código de acceso de empleados",
  hint: "El equipo usa este código para iniciar sesión con su nombre de usuario.",
  unset: "Aún no hay un código configurado.",
  current: "Código activo",
  change: "Cambiar código",
  candidate: "Código nuevo",
  format:
    "Entre 3 y 12 letras de la A a la Z o números. Se guardará en minúsculas.",
  same: "Este código ya está activo.",
  review: "Revisar código",
  reviewing: "Código que se va a activar",
  sample: "Ejemplo de usuario para iniciar sesión",
  changeEffect:
    "El código anterior dejará de servir para iniciar nuevas sesiones. Las sesiones abiertas seguirán activas.",
  retiredRule:
    "Durante 180 días, solo este negocio puede volver a usar el código anterior.",
  confirm: "Confirmar código",
  edit: "Editar código",
  cancel: "Cancelar",
  conflict: "Ese código no está disponible.",
  saved: "Código activado.",
  old: "Los nuevos inicios de sesión ya no usan este código:",
  sessions: "Las sesiones abiertas siguen activas.",
};

export const employeeLoginCodeMessages: Record<Locale, typeof es> = {
  es,
  en: {
    title: "Employee sign-in code",
    hint: "Your team uses this code with their username to sign in.",
    unset: "A code has not been set up yet.",
    current: "Active code",
    change: "Change code",
    candidate: "New code",
    format:
      "Use 3 to 12 letters A to Z or digits. The code will be saved in lowercase.",
    same: "This code is already active.",
    review: "Review code",
    reviewing: "Code to activate",
    sample: "Example sign-in username",
    changeEffect:
      "The previous code will stop working for new sign-ins. Open sessions will stay active.",
    retiredRule:
      "For 180 days, only this business can reclaim the previous code.",
    confirm: "Confirm code",
    edit: "Edit code",
    cancel: "Cancel",
    conflict: "That code is unavailable.",
    saved: "Code activated.",
    old: "New sign-ins no longer use this code:",
    sessions: "Open sessions are still active.",
  },
  ca: {
    title: "Codi d’accés del personal",
    hint: "L’equip utilitza aquest codi amb el nom d’usuari per iniciar sessió.",
    unset: "Encara no hi ha cap codi configurat.",
    current: "Codi actiu",
    change: "Canvia el codi",
    candidate: "Codi nou",
    format:
      "Entre 3 i 12 lletres de la A a la Z o dígits. Es desarà en minúscules.",
    same: "Aquest codi ja està actiu.",
    review: "Revisa el codi",
    reviewing: "Codi que s’activarà",
    sample: "Exemple de nom d’usuari per iniciar sessió",
    changeEffect:
      "El codi anterior deixarà de servir per iniciar sessions noves. Les sessions obertes continuaran actives.",
    retiredRule:
      "Durant 180 dies, només aquest negoci podrà recuperar el codi anterior.",
    confirm: "Confirma el codi",
    edit: "Edita el codi",
    cancel: "Cancel·la",
    conflict: "Aquest codi no està disponible.",
    saved: "Codi activat.",
    old: "Les sessions noves ja no fan servir aquest codi:",
    sessions: "Les sessions obertes continuen actives.",
  },
  gl: {
    title: "Código de acceso do persoal",
    hint: "O equipo usa este código co seu nome de usuario para iniciar sesión.",
    unset: "Aínda non hai ningún código configurado.",
    current: "Código activo",
    change: "Cambiar código",
    candidate: "Código novo",
    format:
      "Entre 3 e 12 letras do A ao Z ou díxitos. Gardarase en minúsculas.",
    same: "Este código xa está activo.",
    review: "Revisar código",
    reviewing: "Código que se vai activar",
    sample: "Exemplo de nome de usuario para iniciar sesión",
    changeEffect:
      "O código anterior deixará de servir para iniciar novas sesións. As sesións abertas seguirán activas.",
    retiredRule:
      "Durante 180 días, só este negocio pode recuperar o código anterior.",
    confirm: "Confirmar código",
    edit: "Editar código",
    cancel: "Cancelar",
    conflict: "Ese código non está dispoñible.",
    saved: "Código activado.",
    old: "Os novos inicios de sesión xa non usan este código:",
    sessions: "As sesións abertas seguen activas.",
  },
  eu: {
    title: "Langileen saioa hasteko kodea",
    hint: "Taldeak kode hau eta erabiltzaile-izena erabiltzen ditu saioa hasteko.",
    unset: "Oraindik ez da koderik konfiguratu.",
    current: "Kode aktiboa",
    change: "Aldatu kodea",
    candidate: "Kode berria",
    format:
      "3 eta 12 karaktere artean, A eta Z arteko letrak edo digituak. Letra xehez gordeko da.",
    same: "Kode hau dagoeneko aktibo dago.",
    review: "Berrikusi kodea",
    reviewing: "Aktibatuko den kodea",
    sample: "Saioa hasteko erabiltzaile-izenaren adibidea",
    changeEffect:
      "Aurreko kodeak ez du saio berriak hasteko balioko. Irekitako saioek aktibo jarraituko dute.",
    retiredRule:
      "180 egunez, negozio honek bakarrik berreskura dezake aurreko kodea.",
    confirm: "Berretsi kodea",
    edit: "Editatu kodea",
    cancel: "Utzi",
    conflict: "Kode hori ez dago erabilgarri.",
    saved: "Kodea aktibatu da.",
    old: "Saio berriek ez dute kode hau erabiltzen:",
    sessions: "Irekitako saioek aktibo jarraitzen dute.",
  },
};
