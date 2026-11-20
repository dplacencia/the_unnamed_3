import { describe, expect, it } from "vitest";
import {
  activeCommitment,
  commitmentAction,
  commitmentFixtureResult,
  commitmentScopeFor,
  fulfillmentKind,
  holdPolicy,
  readCommitmentFixture,
} from "./stock-commitments-model";

describe("stock commitments preview", () => {
  it("requires an explicit partial acceptance and returns exact sourced quantities", () => {
    const full = commitmentAction("reserve", "4", false);
    const partial = commitmentAction("reserve", "4", true);
    expect(commitmentFixtureResult(full)).toEqual({ kind: "declined" });
    expect(commitmentFixtureResult(partial)).toMatchObject({
      kind: "confirmed",
      record: {
        accepted: "3",
        unaccepted: "1",
        outstanding: "3",
        onHand: "10",
        available: "7",
      },
    });
  });

  it("classifies exact decimals against the outstanding amount", () => {
    expect(fulfillmentKind("1,000", activeCommitment)).toBe("partial");
    expect(fulfillmentKind("03.000", activeCommitment)).toBe("full");
    expect(fulfillmentKind("4.000000", activeCommitment)).toBe("unsupported");
    expect(fulfillmentKind("1.5", activeCommitment)).toBe("invalid");
  });

  it("requires a remainder choice for partial fulfillment and preserves the fixture expiry", () => {
    expect(commitmentFixtureResult(commitmentAction("fulfill", "1"))).toEqual({
      kind: "unsupported",
    });
    const result = commitmentFixtureResult(
      commitmentAction("fulfill", "1", false, "keep"),
    );
    expect(result).toMatchObject({
      kind: "confirmed",
      effect: "-1",
      record: {
        outstanding: "2",
        onHand: "9",
        expires: activeCommitment.expires,
      },
    });
  });

  it("releases only the outstanding quantity after a confirmed partial fulfillment", () => {
    const partial = commitmentFixtureResult(
      commitmentAction("fulfill", "1", false, "keep"),
    );
    if (partial.kind !== "confirmed") throw new Error("Missing fixture");
    const result = commitmentFixtureResult(
      commitmentAction("release", "", false, null, partial.record),
    );
    expect(result).toMatchObject({
      kind: "confirmed",
      released: "2",
      record: { outstanding: "0", onHand: "9", fulfilled: "1" },
    });
    expect(result).not.toHaveProperty("effect");
  });

  it("only reads the exact known reference and has distinct unavailable and technical states", () => {
    expect(readCommitmentFixture("R-001", "ready")).toEqual({
      kind: "confirmed",
      record: activeCommitment,
    });
    expect(readCommitmentFixture("R-01", "ready")).toEqual({
      kind: "unavailable",
    });
    expect(readCommitmentFixture("R-001", "error")).toEqual({ kind: "error" });
  });

  it("freezes the exact action without replay or an invented native identity", () => {
    const action = commitmentAction(
      "fulfill",
      "03.000",
      false,
      null,
      activeCommitment,
    );
    expect(Object.isFrozen(action)).toBe(true);
    expect(action).toMatchObject({
      kind: "fulfill",
      reference: activeCommitment.reference,
      quantity: "03.000",
    });
    expect(commitmentFixtureResult(action, "unconfirmed")).toEqual({
      kind: "unconfirmed",
    });
  });

  it("admits only an authorized product, stock location and enabled channel combination", () => {
    expect(commitmentScopeFor("boxes", "stockroom", "counter")?.reference).toBe(
      "R-101",
    );
    expect(commitmentScopeFor("bags", "sales-floor", "pickup")?.reference).toBe(
      "R-102",
    );
    expect(
      commitmentScopeFor("boxes", "sales-floor", "pickup"),
    ).toBeUndefined();
    expect(
      commitmentScopeFor("bags", "sales-floor", "counter"),
    ).toBeUndefined();
  });

  it("requires explicit hold caps, lifetime and extension choices before enabling", () => {
    const draft = {
      perHold: "3",
      total: "unlimited",
      duration: "60",
      lifetime: "180",
      extensions: "disabled",
      extensionDuration: "",
      extensionCount: "",
    } as const;
    expect(holdPolicy(draft)).toMatchObject({
      perHold: "3",
      total: "unlimited",
      extensions: { kind: "disabled" },
    });
    expect(holdPolicy({ ...draft, total: "" })).toBeNull();
    expect(holdPolicy({ ...draft, extensions: "enabled" })).toBeNull();
    expect(
      holdPolicy({
        ...draft,
        extensions: "enabled",
        extensionDuration: "40",
        extensionCount: "2",
      }),
    ).toMatchObject({
      extensions: { kind: "enabled", duration: "40", count: "2" },
    });
  });
});
