import type { Locale } from "@/i18n/configuration";

const es = {
  editRole: "Editar rol",
  deleteRole: "Eliminar rol",
  saveRole: "Guardar cambios",
  roleSaved: "Rol actualizado.",
  roleDeleted: "Rol eliminado.",
  roleEditEffect:
    "Los cambios se aplicarán a todas las asignaciones de este rol, incluidas las inactivas.",
  roleDeleteEffect:
    "Se quitará el rol de todas sus asignaciones, incluidas las inactivas. Las invitaciones pendientes dejarán de conceder este rol.",
  manageMember: "Gestionar acceso",
  remove: "Quitar del negocio",
  deactivate: "Desactivar acceso",
  reactivate: "Reactivar acceso",
  removeEffect:
    "Se eliminarán la pertenencia a este negocio y sus asignaciones.",
  deactivateEffect:
    "Se bloquearán las nuevas solicitudes a este negocio y se conservarán las asignaciones.",
  membershipOnly:
    "La cuenta de la persona y su acceso a otros negocios se mantienen.",
  reactivateEffect:
    "Elige si se conservan las asignaciones vigentes. Los roles eliminados se omiten.",
  keepAssignments: "Conservar asignaciones",
  discardAssignments: "Descartar asignaciones",
  removed: "Se ha quitado a la persona del negocio.",
  deactivated: "Se ha desactivado el acceso a este negocio.",
  reactivated: "Se ha reactivado el acceso a este negocio.",
  invitationTitle: "Invitación a La Huerta",
  authenticatedAs: "Has iniciado sesión como ferran@huerta.example.",
  acceptInvitation: "Aceptar invitación",
  invitationExpired: "La invitación ha caducado.",
  askToResend: "Pide al negocio que te envíe otra invitación.",
  invitationUnavailable: "No se puede usar esta invitación.",
  deliveryUnconfirmed: "No hemos podido confirmar el envío de la invitación.",
  reviewSameDelivery: "Comprobar el envío",
  resendFailed:
    "No se ha enviado el reemplazo. La invitación anterior conserva su estado y su plazo.",
  resendRefused:
    "No se puede reenviar con las asignaciones anteriores. Revisa los roles antes de enviar el reemplazo.",
  reviewResend: "Revisar asignaciones",
  previous: "Anterior",
  next: "Siguiente",
};

export const coreTeamLifecycleMessages: Record<Locale, typeof es> = {
  es,
  en: {
    editRole: "Edit role",
    deleteRole: "Delete role",
    saveRole: "Save changes",
    roleSaved: "Role updated.",
    roleDeleted: "Role deleted.",
    roleEditEffect:
      "Changes apply to every assignment of this role, including inactive ones.",
    roleDeleteEffect:
      "This removes the role from every assignment, including inactive ones. Pending invitations will no longer grant this role.",
    manageMember: "Manage access",
    remove: "Remove from business",
    deactivate: "Deactivate access",
    reactivate: "Reactivate access",
    removeEffect:
      "Membership and assignments in this business will be removed.",
    deactivateEffect:
      "New requests to this business will be blocked and assignments will be retained.",
    membershipOnly:
      "The person's account and access to other businesses remain available.",
    reactivateEffect:
      "Choose whether to keep existing assignments. Deleted roles are skipped.",
    keepAssignments: "Keep assignments",
    discardAssignments: "Discard assignments",
    removed: "The person was removed from this business.",
    deactivated: "Access to this business was deactivated.",
    reactivated: "Access to this business was reactivated.",
    invitationTitle: "Invitation to La Huerta",
    authenticatedAs: "You are signed in as ferran@huerta.example.",
    acceptInvitation: "Accept invitation",
    invitationExpired: "The invitation has expired.",
    askToResend: "Ask the business to send a new invitation.",
    invitationUnavailable: "This invitation cannot be used.",
    deliveryUnconfirmed: "We could not confirm that the invitation was sent.",
    reviewSameDelivery: "Check delivery",
    resendFailed:
      "The replacement could not be sent. The previous invitation keeps its status and deadline.",
    resendRefused:
      "The previous assignments cannot be resent. Review the roles before sending a replacement.",
    reviewResend: "Review assignments",
    previous: "Previous",
    next: "Next",
  },
  ca: {
    editRole: "Edita el rol",
    deleteRole: "Suprimeix el rol",
    saveRole: "Desa els canvis",
    roleSaved: "Rol actualitzat.",
    roleDeleted: "Rol suprimit.",
    roleEditEffect:
      "Els canvis s'aplicaran a totes les assignacions d'aquest rol, incloses les inactives.",
    roleDeleteEffect:
      "El rol es retirarà de totes les assignacions, incloses les inactives. Les invitacions pendents deixaran de concedir-lo.",
    manageMember: "Gestiona l'accés",
    remove: "Treu del negoci",
    deactivate: "Desactiva l'accés",
    reactivate: "Reactiva l'accés",
    removeEffect:
      "Se suprimiran la pertinença a aquest negoci i les seves assignacions.",
    deactivateEffect:
      "Es bloquejaran les noves sol·licituds a aquest negoci i es conservaran les assignacions.",
    membershipOnly:
      "El compte de la persona i l'accés a altres negocis es mantenen.",
    reactivateEffect:
      "Tria si vols conservar les assignacions vigents. Els rols suprimits s'ometen.",
    keepAssignments: "Conserva les assignacions",
    discardAssignments: "Descarta les assignacions",
    removed: "S'ha tret la persona del negoci.",
    deactivated: "S'ha desactivat l'accés a aquest negoci.",
    reactivated: "S'ha reactivat l'accés a aquest negoci.",
    invitationTitle: "Invitació a La Huerta",
    authenticatedAs: "Has iniciat la sessió com a ferran@huerta.example.",
    acceptInvitation: "Accepta la invitació",
    invitationExpired: "La invitació ha caducat.",
    askToResend: "Demana al negoci que t'enviï una altra invitació.",
    invitationUnavailable: "Aquesta invitació no es pot fer servir.",
    deliveryUnconfirmed: "No hem pogut confirmar l'enviament de la invitació.",
    reviewSameDelivery: "Comprova l'enviament",
    resendFailed:
      "No s'ha enviat la nova invitació. L'anterior conserva l'estat i el termini.",
    resendRefused:
      "No es pot reenviar amb les assignacions anteriors. Revisa els rols abans d'enviar una nova invitació.",
    reviewResend: "Revisa les assignacions",
    previous: "Anterior",
    next: "Següent",
  },
  gl: {
    editRole: "Editar rol",
    deleteRole: "Eliminar rol",
    saveRole: "Gardar cambios",
    roleSaved: "Rol actualizado.",
    roleDeleted: "Rol eliminado.",
    roleEditEffect:
      "Os cambios aplicaranse a todas as asignacións deste rol, incluídas as inactivas.",
    roleDeleteEffect:
      "Retirarase o rol de todas as asignacións, incluídas as inactivas. As invitacións pendentes deixarán de conceder este rol.",
    manageMember: "Xestionar acceso",
    remove: "Retirar do negocio",
    deactivate: "Desactivar acceso",
    reactivate: "Reactivar acceso",
    removeEffect:
      "Eliminaranse a pertenza a este negocio e as súas asignacións.",
    deactivateEffect:
      "Bloquearanse as novas solicitudes a este negocio e conservaranse as asignacións.",
    membershipOnly:
      "Mantéñense a conta da persoa e o seu acceso a outros negocios.",
    reactivateEffect:
      "Escolle se queres conservar as asignacións vixentes. Os roles eliminados omítense.",
    keepAssignments: "Conservar asignacións",
    discardAssignments: "Descartar asignacións",
    removed: "Retirouse a persoa do negocio.",
    deactivated: "Desactivouse o acceso a este negocio.",
    reactivated: "Reactivouse o acceso a este negocio.",
    invitationTitle: "Invitación a La Huerta",
    authenticatedAs: "Iniciaches sesión como ferran@huerta.example.",
    acceptInvitation: "Aceptar invitación",
    invitationExpired: "A invitación caducou.",
    askToResend: "Pídelle ao negocio que che envíe outra invitación.",
    invitationUnavailable: "Non se pode usar esta invitación.",
    deliveryUnconfirmed: "Non puidemos confirmar o envío da invitación.",
    reviewSameDelivery: "Comprobar o envío",
    resendFailed:
      "Non se enviou a nova invitación. A anterior conserva o estado e o prazo.",
    resendRefused:
      "Non se pode reenviar coas asignacións anteriores. Revisa os roles antes de enviar outra invitación.",
    reviewResend: "Revisar asignacións",
    previous: "Anterior",
    next: "Seguinte",
  },
  eu: {
    editRole: "Editatu rola",
    deleteRole: "Ezabatu rola",
    saveRole: "Gorde aldaketak",
    roleSaved: "Rola eguneratu da.",
    roleDeleted: "Rola ezabatu da.",
    roleEditEffect:
      "Aldaketak rol honen esleipen guztiei aplikatuko zaizkie, aktibo ez daudenei ere.",
    roleDeleteEffect:
      "Rola esleipen guztietatik kenduko da, aktibo ez daudenetatik ere. Zain dauden gonbidapenek ez dute rol hau emango.",
    manageMember: "Kudeatu sarbidea",
    remove: "Kendu negoziotik",
    deactivate: "Desaktibatu sarbidea",
    reactivate: "Berraktibatu sarbidea",
    removeEffect: "Negozio honetako kidetza eta esleipenak kenduko dira.",
    deactivateEffect:
      "Negozio honetarako eskaera berriak blokeatuko dira eta esleipenak gordeko dira.",
    membershipOnly:
      "Pertsonaren kontua eta beste negozioetarako sarbidea mantenduko dira.",
    reactivateEffect:
      "Aukeratu indarreko esleipenak mantendu nahi dituzun. Ezabatutako rolak ez dira aplikatuko.",
    keepAssignments: "Mantendu esleipenak",
    discardAssignments: "Baztertu esleipenak",
    removed: "Pertsona negoziotik kendu da.",
    deactivated: "Negozio honetarako sarbidea desaktibatu da.",
    reactivated: "Negozio honetarako sarbidea berraktibatu da.",
    invitationTitle: "La Huertarako gonbidapena",
    authenticatedAs: "Saioa ferran@huerta.example gisa hasi duzu.",
    acceptInvitation: "Onartu gonbidapena",
    invitationExpired: "Gonbidapena iraungi da.",
    askToResend: "Eskatu negozioari beste gonbidapen bat bidaltzeko.",
    invitationUnavailable: "Gonbidapen hau ezin da erabili.",
    deliveryUnconfirmed: "Ezin izan dugu baieztatu gonbidapena bidali denik.",
    reviewSameDelivery: "Egiaztatu bidalketa",
    resendFailed:
      "Gonbidapen berria ezin izan da bidali. Aurrekoak egoera eta epea mantentzen ditu.",
    resendRefused:
      "Ezin da berriro bidali aurreko esleipenekin. Berrikusi rolak beste gonbidapen bat bidali aurretik.",
    reviewResend: "Berrikusi esleipenak",
    previous: "Aurrekoa",
    next: "Hurrengoa",
  },
};

export type TeamLifecycleCopy = typeof es;
