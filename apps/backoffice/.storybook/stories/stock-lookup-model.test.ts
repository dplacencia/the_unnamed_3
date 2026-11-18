import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  type StockOutcome,
  type StockPair,
  useStockLookup,
} from "./stock-lookup-model";

const pairA = { productId: "tomatoes", locationId: "stockroom" };
const pairB = { productId: "tomatoes", locationId: "shop" };
const exactBalance = { amount: "-12.000000000000000001", unit: "kg" };

function setup(initialPair: StockPair | null = pairA) {
  const requests: {
    pair: StockPair;
    resolve: (outcome: StockOutcome) => void;
    reject: (reason: Error) => void;
  }[] = [];
  const read = vi.fn(
    (pair: StockPair) =>
      new Promise<StockOutcome>((resolve, reject) => {
        requests.push({ pair, resolve, reject });
      }),
  );
  const renders: ReturnType<typeof useStockLookup>[] = [];
  const view = renderHook(
    (pair: StockPair | null) => {
      // Pass a fresh callback on every render to verify it does not trigger a read.
      const lookup = useStockLookup(pair, (selected) => read(selected));
      renders.push(lookup);
      return lookup;
    },
    { initialProps: initialPair },
  );
  return {
    ...view,
    read,
    renders,
    requests,
    respond: (index: number, outcome: StockOutcome) =>
      act(async () => requests[index].resolve(outcome)),
  };
}

describe("useStockLookup", () => {
  it("waits for a complete pair and preserves an exact signed quantity", async () => {
    const lookup = setup(null);
    expect(lookup.result.current.status).toBe("idle");
    expect(lookup.read).not.toHaveBeenCalled();

    lookup.rerender(pairA);
    expect(lookup.requests.map(({ pair }) => pair)).toEqual([pairA]);
    expect(lookup.result.current).toMatchObject({
      status: "loading",
      outcome: null,
      previous: null,
    });

    const outcome: StockOutcome = { kind: "balance", balance: exactBalance };
    await lookup.respond(0, outcome);
    expect(lookup.result.current).toMatchObject({
      status: "result",
      outcome,
      previous: null,
    });
  });

  it("ignores superseded responses when selection goes A → B → A", async () => {
    const lookup = setup();
    lookup.rerender(pairB);
    lookup.rerender(pairA);
    expect(lookup.requests.map(({ pair }) => pair)).toEqual([
      pairA,
      pairB,
      pairA,
    ]);

    await lookup.respond(0, { kind: "balance", balance: exactBalance });
    expect(lookup.result.current).toMatchObject({
      status: "loading",
      outcome: null,
      previous: null,
    });

    const recordedZero: StockOutcome = {
      kind: "balance",
      balance: { amount: "0", unit: "kg" },
    };
    await lookup.respond(2, recordedZero);
    await lookup.respond(1, { kind: "no-record" });
    expect(lookup.result.current.outcome).toEqual(recordedZero);
  });

  it("clears the previous selection before rendering a changed or incomplete pair", async () => {
    const lookup = setup();
    await lookup.respond(0, { kind: "balance", balance: exactBalance });
    act(() => lookup.result.current.refresh());
    expect(lookup.result.current.previous).toEqual(exactBalance);

    const changed = lookup.renders.length;
    lookup.rerender(pairB);
    expect(lookup.renders[changed]).toMatchObject({
      status: "loading",
      outcome: null,
      previous: null,
    });
    await lookup.respond(2, { kind: "balance", balance: exactBalance });

    const cleared = lookup.renders.length;
    lookup.rerender(null);
    expect(lookup.renders[cleared]).toMatchObject({
      status: "idle",
      outcome: null,
      previous: null,
    });
    expect(lookup.read).toHaveBeenCalledTimes(3);
  });

  it("marks the previous balance during refresh and technical failure until an exact result replaces it", async () => {
    const lookup = setup();
    await lookup.respond(0, { kind: "balance", balance: exactBalance });
    act(() => {
      lookup.result.current.refresh();
      lookup.result.current.refresh();
    });
    expect(lookup.requests.map(({ pair }) => pair)).toEqual([pairA, pairA]);
    expect(lookup.result.current).toMatchObject({
      status: "loading",
      outcome: null,
      previous: exactBalance,
    });

    await lookup.respond(1, { kind: "error" });
    expect(lookup.result.current).toMatchObject({
      status: "result",
      outcome: { kind: "error" },
      previous: exactBalance,
    });
    act(() => lookup.result.current.refresh());
    expect(lookup.result.current.previous).toEqual(exactBalance);
    await lookup.respond(2, { kind: "no-record" });
    expect(lookup.result.current).toMatchObject({
      status: "result",
      outcome: { kind: "no-record" },
      previous: null,
    });

    act(() => lookup.result.current.refresh());
    expect(lookup.result.current).toMatchObject({
      status: "loading",
      previous: null,
    });
  });

  it.each([
    { kind: "denied", hideLocation: true },
    { kind: "invalid" },
  ] as const)(
    "clears the previous balance after a $kind outcome and waits for a new selection",
    async (outcome) => {
      const lookup = setup();
      await lookup.respond(0, { kind: "balance", balance: exactBalance });
      act(() => lookup.result.current.refresh());
      await lookup.respond(1, outcome);
      expect(lookup.result.current).toMatchObject({
        status: "result",
        outcome,
        previous: null,
      });
      act(() => lookup.result.current.refresh());
      expect(lookup.read).toHaveBeenCalledTimes(2);

      lookup.rerender(pairB);
      expect(lookup.requests[2].pair).toEqual(pairB);
    },
  );

  it("shows a rejected initial read as a technical failure without reading again on focus", async () => {
    const lookup = setup();
    await act(async () => lookup.requests[0].reject(new Error("Unavailable")));
    expect(lookup.result.current).toMatchObject({
      status: "result",
      outcome: { kind: "error" },
      previous: null,
    });

    act(() => window.dispatchEvent(new Event("focus")));
    lookup.rerender({ ...pairA });
    expect(lookup.read).toHaveBeenCalledTimes(1);
  });
});
