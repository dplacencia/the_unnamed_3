import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  type InspectionOutcome,
  usePendingReceiptInspection,
} from "./pending-receipt-inspection-model";

const lineA = "Line_00001-aBc";
const lineB = "Line_00002-FgH";
const pending: InspectionOutcome = {
  kind: "found",
  detail: {
    product: null,
    location: "Warehouse",
    quantity: "0.123456789",
    unit: null,
    outcome: { kind: "pending", reasons: ["Product and unit unresolved"] },
  },
};
const applied: InspectionOutcome = {
  kind: "found",
  detail: {
    product: "Tomatoes",
    location: "Warehouse",
    quantity: "500",
    unit: "g",
    outcome: { kind: "applied", effect: { quantity: "0.5", unit: "kg" } },
  },
};

function setup() {
  const requests: {
    lineReference: string;
    resolve: (outcome: InspectionOutcome) => void;
    reject: (reason: Error) => void;
  }[] = [];
  const read = vi.fn(
    (lineReference: string) =>
      new Promise<InspectionOutcome>((resolve, reject) => {
        requests.push({ lineReference, resolve, reject });
      }),
  );
  const renders: ReturnType<typeof usePendingReceiptInspection>["state"][] = [];
  const open = (lineReference = lineA) =>
    renderHook(
      (reference: string) => {
        // A new callback must not start a new read for the same consultation.
        const inspection = usePendingReceiptInspection(reference, (id) =>
          read(id),
        );
        renders.push(inspection.state);
        return inspection;
      },
      { initialProps: lineReference },
    );
  return {
    open,
    read,
    renders,
    requests,
    respond: (index: number, outcome: InspectionOutcome) =>
      act(async () => requests[index].resolve(outcome)),
  };
}

describe("usePendingReceiptInspection", () => {
  it("reads the unchanged reference on open and preserves independently known facts", async () => {
    const { open, read, respond } = setup();
    const view = open();
    expect(view.result.current.state).toEqual({ kind: "loading" });
    expect(read).toHaveBeenCalledExactlyOnceWith(lineA);

    await respond(0, pending);
    expect(view.result.current.state).toEqual(pending);
    view.rerender(lineA);
    expect(read).toHaveBeenCalledTimes(1);
  });

  it("clears the current detail during refresh and accepts the new outcome for that line", async () => {
    const { open, requests, respond } = setup();
    const view = open();
    await respond(0, pending);

    act(() => {
      view.result.current.refresh();
      view.result.current.refresh();
    });
    expect(view.result.current.state).toEqual({ kind: "loading" });
    expect(requests.map(({ lineReference }) => lineReference)).toEqual([
      lineA,
      lineA,
    ]);

    await respond(1, applied);
    expect(view.result.current.state).toEqual(applied);
  });

  it("keeps unavailable distinct and offers no refresh from that result", async () => {
    const { open, read, respond } = setup();
    const view = open();
    await respond(0, pending);
    act(() => view.result.current.refresh());
    await respond(1, { kind: "unavailable" });

    expect(view.result.current.state).toEqual({ kind: "unavailable" });
    act(() => view.result.current.refresh());
    expect(read).toHaveBeenCalledTimes(2);
  });

  it("reports an interrupted read as a technical error and retries only on request", async () => {
    const { open, requests, respond } = setup();
    const view = open();
    await act(async () => requests[0].reject(new Error("Unavailable")));
    expect(view.result.current.state).toEqual({ kind: "error" });
    expect(requests).toHaveLength(1);

    act(() => view.result.current.refresh());
    expect(view.result.current.state).toEqual({ kind: "loading" });
    expect(requests[1].lineReference).toBe(lineA);
    await respond(1, pending);
    expect(view.result.current.state).toEqual(pending);
  });

  it("masks previous details on the first render for a different reference", async () => {
    const { open, renders, respond } = setup();
    const view = open();
    await respond(0, pending);
    const before = renders.length;

    view.rerender(lineB);
    expect(renders[before]).toEqual({ kind: "loading" });
    expect(view.result.current.state).toEqual({ kind: "loading" });
  });

  it("ignores superseded responses when the original line is selected again", async () => {
    const { open, requests, respond } = setup();
    const view = open();
    view.rerender(lineB);
    view.rerender(lineA);
    expect(requests.map(({ lineReference }) => lineReference)).toEqual([
      lineA,
      lineB,
      lineA,
    ]);

    await respond(0, pending);
    expect(view.result.current.state).toEqual({ kind: "loading" });
    await respond(2, applied);
    await respond(1, { kind: "unavailable" });
    expect(view.result.current.state).toEqual(applied);
  });

  it("starts a fresh inspection on reopening and ignores the closed view's reply", async () => {
    const { open, requests, respond } = setup();
    open().unmount();
    const reopened = open();
    expect(requests).toHaveLength(2);

    await respond(0, pending);
    expect(reopened.result.current.state).toEqual({ kind: "loading" });
    await respond(1, applied);
    expect(reopened.result.current.state).toEqual(applied);
  });
});
