import { describe, expect, it } from "vitest";
import {
  capabilityEnablementFixture,
  applyCapabilityCommand,
} from "./core-capability-enablement-model";

describe("Core capability enablement", () => {
  it("enables Stock independently of Catalogue", () => {
    const { state } = capabilityEnablementFixture("explore");
    const result = applyCapabilityCommand(state, "stock", true);
    expect(result).toMatchObject({
      kind: "confirmed",
      configuration: { stock: true, catalogue: false, pricing: false },
    });
    expect(state.configuration).toEqual({
      stock: false,
      catalogue: false,
      pricing: false,
    });
  });

  it("names both capabilities when a prerequisite is missing", () => {
    const { state } = capabilityEnablementFixture("explore");
    expect(applyCapabilityCommand(state, "pricing", true)).toEqual({
      kind: "missing-prerequisite",
      capability: "pricing",
      prerequisite: "catalogue",
    });
    expect(state.configuration).toEqual({
      stock: false,
      catalogue: false,
      pricing: false,
    });
  });

  it("blocks deactivation of a prerequisite without cascading", () => {
    const { state } = capabilityEnablementFixture("disable-blocked");
    expect(applyCapabilityCommand(state, "catalogue", false)).toEqual({
      kind: "enabled-dependent",
      capability: "catalogue",
      dependent: "pricing",
    });
    expect(state.configuration).toEqual({
      stock: false,
      catalogue: true,
      pricing: true,
    });
  });

  it("retains confirmed configuration during a provider outage while Core stays reachable", () => {
    const { state } = capabilityEnablementFixture("provider-unavailable");
    expect(state.configuration).toMatchObject({ catalogue: true, stock: true });
    expect(state.inventoryProvider).toBe("unavailable");
    expect(applyCapabilityCommand(state, "stock", false)).toMatchObject({
      kind: "confirmed",
      configuration: { catalogue: true, stock: false },
    });
  });

  it("prevents submission without current management authority", () => {
    const unavailable = capabilityEnablementFixture(
      "management-unavailable",
    ).state;
    const denied = capabilityEnablementFixture("read-only").state;
    expect(applyCapabilityCommand(unavailable, "catalogue", false)).toEqual({
      kind: "authority-unavailable",
    });
    expect(applyCapabilityCommand(denied, "stock", false)).toEqual({
      kind: "access-denied",
    });
  });
});
