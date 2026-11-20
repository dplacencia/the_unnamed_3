export const administrativeResources = [
  { id: "site-centro", kind: "site", name: "Centro" },
  {
    id: "area-floor",
    kind: "area",
    name: "Sala de ventas",
    siteId: "site-centro",
  },
  {
    id: "area-stockroom",
    kind: "area",
    name: "Almacén",
    siteId: "site-centro",
  },
  { id: "site-market", kind: "site", name: "Mercado" },
  { id: "area-stall", kind: "area", name: "Puesto", siteId: "site-market" },
] as const;

export type AdministrativeResource = (typeof administrativeResources)[number];
export type ResourceId = AdministrativeResource["id"];
export type EmployeeProfile = "owner" | "delegate";
export type EmployeeState = "enabled" | "disabled" | "blocked";
export type EmployeeRole = {
  name: string;
  scopeId: ResourceId;
  deleted?: boolean;
};
export type EmployeeAccount = {
  id: string;
  name: string;
  lastName: string | null;
  username: string;
  administrativeId: ResourceId;
  state: EmployeeState;
  roles: readonly EmployeeRole[];
};

export const employees: readonly EmployeeAccount[] = [
  {
    id: "alba",
    name: "Alba",
    lastName: "Ríos",
    username: "alba",
    administrativeId: "area-floor",
    state: "enabled",
    roles: [{ name: "Consulta de existencias", scopeId: "area-floor" }],
  },
  {
    id: "pablo",
    name: "Pablo",
    lastName: "Lago",
    username: "pablo",
    administrativeId: "site-centro",
    state: "disabled",
    roles: [
      { name: "Movimientos de almacén", scopeId: "site-market" },
      {
        name: "Control previo de almacén",
        scopeId: "area-stockroom",
        deleted: true,
      },
    ],
  },
  {
    id: "irene",
    name: "Irene",
    lastName: "Gil",
    username: "irene",
    administrativeId: "site-centro",
    state: "enabled",
    roles: [{ name: "Consulta de existencias", scopeId: "site-market" }],
  },
  {
    id: "leire",
    name: "Leire",
    lastName: "Mena",
    username: "leire",
    administrativeId: "site-centro",
    state: "enabled",
    roles: [],
  },
];

export const sampleTemporaryPassword = "Irin-Demo-Sin-Acceso-37";
export const sampleMerchantCode = "huerta";

export function employeeName(account: EmployeeAccount) {
  return [account.name, account.lastName].filter(Boolean).join(" ");
}

export function qualifiedUsername(account: EmployeeAccount) {
  return `${account.username}.${sampleMerchantCode}`;
}

export function administrativeResource(id: ResourceId) {
  return administrativeResources.find((resource) => resource.id === id)!;
}

function covers(profile: EmployeeProfile, id: ResourceId) {
  if (profile === "owner" || id === "site-centro") return true;
  const resource = administrativeResource(id);
  return resource.kind === "area" && resource.siteId === "site-centro";
}

export function administrativeChoices(profile: EmployeeProfile) {
  return administrativeResources.filter(({ id }) => covers(profile, id));
}

export function createEmployeeDraft(
  profile: EmployeeProfile,
  name: string,
  lastName: string,
  localUsername: string,
  resourceId: string,
  existing: readonly EmployeeAccount[] = employees,
): EmployeeAccount | undefined {
  if (!name.trim() || !/^[a-zA-Z0-9]{3,32}$/.test(localUsername))
    return undefined;
  const username = localUsername.toLowerCase();
  const location = administrativeChoices(profile).find(
    ({ id }) => id === resourceId,
  );
  if (!location || existing.some((account) => account.username === username))
    return undefined;
  return {
    id: `employee-${username}`,
    name,
    lastName: lastName || null,
    username,
    administrativeId: location.id,
    state: "enabled",
    roles: [],
  };
}

export function accountAction(
  profile: EmployeeProfile,
  account: EmployeeAccount,
  action: "disable" | "move" | "restore" | "reconcile",
) {
  if (!covers(profile, account.administrativeId)) return false;
  if (action === "restore") return account.state === "disabled";
  if (profile === "delegate" && account.id === "leire") return false;
  if (action === "move") return account.state !== "blocked";
  const required = action === "disable" ? "enabled" : "blocked";
  return (
    account.state === required &&
    account.roles.every((role) => role.deleted || covers(profile, role.scopeId))
  );
}

export function moveAdministrativeLocation(
  profile: EmployeeProfile,
  account: EmployeeAccount,
  destination: ResourceId,
): EmployeeAccount | undefined {
  if (
    !accountAction(profile, account, "move") ||
    !covers(profile, destination) ||
    destination === account.administrativeId
  )
    return undefined;
  return { ...account, administrativeId: destination };
}

export type DisablementOutcome = "confirmed" | "unavailable" | "unconfirmed";

export function updateDisabledOutcome(
  account: EmployeeAccount,
  outcome: DisablementOutcome,
): EmployeeAccount {
  if (outcome === "unavailable") return account;
  return {
    ...account,
    state: outcome === "confirmed" ? "disabled" : "blocked",
  };
}

export function restoreEmployee(
  profile: EmployeeProfile,
  account: EmployeeAccount,
  choice: "keep" | "discard" | "",
): EmployeeAccount | undefined {
  if (!choice || !accountAction(profile, account, "restore")) return undefined;
  const retained = account.roles.filter((role) => !role.deleted);
  // The delegated fixture only has employee-management authority.
  if (profile !== "owner" && retained.length) return undefined;
  return {
    ...account,
    state: "enabled",
    roles: choice === "keep" ? retained : [],
  };
}
