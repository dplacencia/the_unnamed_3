import { describe, expect, it } from "vitest";
import {
  createResolutionSimulator,
  prepareResolutionCommand,
  resolutionReasonValid,
} from "./pending-resolution-model";
import {
  counterpartSelectionFixture,
  partialReceiptReleaseFixture,
  resolutionFixtures,
} from "./pending-resolution-fixtures";

describe("Pending resolution review", () => {
  it("uses the fixed reason profile and preserves accepted text exactly", () => {
    expect(resolutionReasonValid("\u00a0\t\u2028")).toBe(false);
    expect(resolutionReasonValid("Texto\u0085")).toBe(false);
    expect(resolutionReasonValid("é".repeat(2049))).toBe(false);
    expect(resolutionReasonValid("é".repeat(2048))).toBe(true);

    const reason = "  El proveedor confirmó la falta.\n\tAlbarán 34.  ";
    const command = prepareResolutionCommand(resolutionFixtures.rejection, {
      operationId: "reject-1",
      confirmed: true,
      reason,
    });
    expect(command?.request).toEqual({
      kind: "reject",
      lineReference: resolutionFixtures.rejection.line.reference,
      reason,
    });
  });

  it("requires a selected eligible channel and confirmation for release", () => {
    const departure = resolutionFixtures.release;
    const draft = {
      operationId: "release-1",
      confirmed: true,
      channelId: "channel-counter",
    };
    expect(
      prepareResolutionCommand(departure, { ...draft, confirmed: false }),
    ).toBeNull();
    expect(
      prepareResolutionCommand(departure, {
        ...draft,
        channelId: "unavailable",
      }),
    ).toBeNull();
    const command = prepareResolutionCommand(departure, draft);
    expect(command?.request).toEqual({
      kind: "release",
      lineReference: departure.line.reference,
      corrections: { channelId: "channel-counter" },
    });
    expect(Object.isFrozen(command?.request)).toBe(true);
    expect(Object.isFrozen(command)).toBe(true);
  });

  it("uses full batch identities only when counterpart facts are available", () => {
    const draft = {
      operationId: "cancel-1",
      confirmed: true,
      reason: "Mismo albarán",
    };
    expect(
      prepareResolutionCommand(
        resolutionFixtures.counterpartUnavailable,
        draft,
      ),
    ).toBeNull();
    const command = prepareResolutionCommand(
      resolutionFixtures.duplicate,
      draft,
    );
    expect(command?.request).toEqual({
      kind: "cancel",
      target: {
        merchantId: "merchant-demo",
        originNamespace: "backoffice",
        callerOperationId: "receipt-204",
      },
      counterpart: {
        merchantId: "merchant-demo",
        originNamespace: "backoffice",
        callerOperationId: "receipt-198",
      },
      reason: "Mismo albarán",
    });
    const simulator = createResolutionSimulator();
    expect(
      simulator.attempt(resolutionFixtures.duplicate, command!, true),
    ).toMatchObject({
      kind: "resolved",
      original: { kind: "rejected", reason: "duplicate-batch-cancelled" },
      references: resolutionFixtures.duplicate.targetReferences,
    });
  });

  it("recovers one authoritative effect with the identical command and current authority", () => {
    const fixture = resolutionFixtures.release;
    const draft = {
      operationId: "release-1",
      confirmed: true,
      channelId: "channel-counter",
    };
    const command = prepareResolutionCommand(fixture, draft)!;
    const simulator = createResolutionSimulator({ loseFirstReply: true });
    expect(simulator.attempt(fixture, command, true)).toEqual({
      kind: "unconfirmed",
    });
    expect(simulator.attempt(fixture, command, false)).toEqual({
      kind: "denied",
    });
    expect(
      simulator.attempt(
        fixture,
        prepareResolutionCommand(fixture, {
          ...draft,
          channelId: "channel-pickup",
        })!,
        true,
      ),
    ).toEqual({ kind: "refused", reason: "conflict" });
    const recovered = simulator.attempt(fixture, command, true);
    expect(recovered).toEqual({
      kind: "resolved",
      original: { kind: "applied", effect: { quantity: "-2.5", unit: "kg" } },
      references: [fixture.line.reference],
    });
    expect(simulator.attempt(fixture, command, true)).toBe(recovered);
    expect(
      simulator.attempt(
        fixture,
        prepareResolutionCommand(fixture, {
          ...draft,
          operationId: "new-operation",
        })!,
        true,
      ),
    ).toEqual({ kind: "refused", reason: "already-resolved" });
    expect(simulator.appliedEffects()).toBe(1);
  });

  it("releases only the exact actual receipt quantity without replacing its unit", () => {
    const fixture = partialReceiptReleaseFixture;
    const draft = { operationId: "receipt-release-1", confirmed: true };
    for (const quantity of ["", "0", "8", "3.5"]) {
      expect(
        prepareResolutionCommand(fixture, { ...draft, quantity }),
      ).toBeNull();
    }
    const command = prepareResolutionCommand(fixture, {
      ...draft,
      quantity: "03",
    })!;
    expect(command.request).toEqual({
      kind: "release",
      lineReference: fixture.line.reference,
      corrections: { quantity: "3" },
    });
    const simulator = createResolutionSimulator();
    expect(simulator.attempt(fixture, command, true)).toMatchObject({
      kind: "resolved",
      original: { kind: "applied", effect: { quantity: "3", unit: "piece" } },
    });
    expect(fixture.line.quantity).toBe("8");
  });

  it("requires an explicit trusted surviving batch and retains its full identity", () => {
    const fixture = counterpartSelectionFixture;
    const draft = {
      operationId: "cancel-2",
      reason: "Same shipment",
      confirmed: true,
    };
    expect(prepareResolutionCommand(fixture, draft)).toBeNull();
    expect(
      prepareResolutionCommand(fixture, {
        ...draft,
        counterpartId: "receipt-foreign",
      }),
    ).toBeNull();
    const command = prepareResolutionCommand(fixture, {
      ...draft,
      counterpartId: "receipt-197",
    })!;
    expect(command.request).toMatchObject({
      kind: "cancel",
      counterpart: {
        merchantId: "merchant-demo",
        originNamespace: "backoffice",
        callerOperationId: "receipt-197",
      },
    });
    expect(
      createResolutionSimulator().attempt(fixture, command, true),
    ).toMatchObject({
      kind: "resolved",
      references: fixture.targetReferences,
    });
  });
});
