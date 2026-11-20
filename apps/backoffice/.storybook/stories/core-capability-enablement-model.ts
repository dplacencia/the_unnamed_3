export const coreCapabilities = ["catalogue", "stock", "pricing"] as const;

export type CoreCapability = (typeof coreCapabilities)[number];
type CapabilityConfiguration = Readonly<Record<CoreCapability, boolean>>;
export type CapabilityState = Readonly<{
  configuration: CapabilityConfiguration;
  inventoryProvider: "available" | "unavailable";
  management: "allowed" | "denied" | "unavailable";
}>;

export type CapabilityOutcome =
  | {
      kind: "confirmed";
      capability: CoreCapability;
      enabled: boolean;
      configuration: CapabilityConfiguration;
    }
  | {
      kind: "missing-prerequisite";
      capability: "pricing";
      prerequisite: "catalogue";
    }
  | { kind: "enabled-dependent"; capability: "catalogue"; dependent: "pricing" }
  | { kind: "authority-unavailable" | "access-denied" };

export type CapabilityFixture =
  | "explore"
  | "prerequisite-blocked"
  | "disable-blocked"
  | "provider-unavailable"
  | "management-unavailable"
  | "read-only";

export function applyCapabilityCommand(
  state: CapabilityState,
  capability: CoreCapability,
  enabled: boolean,
): CapabilityOutcome {
  if (state.management === "unavailable")
    return { kind: "authority-unavailable" };
  if (state.management === "denied") return { kind: "access-denied" };

  const { configuration } = state;
  if (capability === "pricing" && enabled && !configuration.catalogue)
    return {
      kind: "missing-prerequisite",
      capability,
      prerequisite: "catalogue",
    };
  if (capability === "catalogue" && !enabled && configuration.pricing)
    return { kind: "enabled-dependent", capability, dependent: "pricing" };

  return {
    kind: "confirmed",
    capability,
    enabled,
    configuration: { ...configuration, [capability]: enabled },
  };
}

export function capabilityEnablementFixture(fixture: CapabilityFixture): {
  state: CapabilityState;
  outcome: CapabilityOutcome | null;
} {
  const state: CapabilityState = {
    configuration: {
      catalogue: [
        "disable-blocked",
        "provider-unavailable",
        "management-unavailable",
      ].includes(fixture),
      stock: ["provider-unavailable", "read-only"].includes(fixture),
      pricing: fixture === "disable-blocked",
    },
    inventoryProvider:
      fixture === "provider-unavailable" ? "unavailable" : "available",
    management:
      fixture === "management-unavailable"
        ? "unavailable"
        : fixture === "read-only"
          ? "denied"
          : "allowed",
  };
  if (fixture === "prerequisite-blocked")
    return { state, outcome: applyCapabilityCommand(state, "pricing", true) };
  if (fixture === "disable-blocked")
    return {
      state,
      outcome: applyCapabilityCommand(state, "catalogue", false),
    };
  return { state, outcome: null };
}
