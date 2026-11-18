import { useCallback, useEffect, useEffectEvent, useState } from "react";

export type StockPair = { productId: string; locationId: string };
export type StockBalance = { amount: string; unit: string };

export type StockOutcome =
  | { kind: "balance"; balance: StockBalance }
  | { kind: "no-record" }
  | { kind: "denied"; hideProduct?: boolean; hideLocation?: boolean }
  | { kind: "invalid" }
  | { kind: "error" };

type LookupState = {
  key: string | null;
  pair: StockPair | null;
  generation: number;
  status: "idle" | "loading" | "result";
  outcome: StockOutcome | null;
  previous: StockBalance | null;
};

function startLookup(
  key: LookupState["key"],
  pair: StockPair | null,
  generation: number,
  previous: StockBalance | null = null,
): LookupState {
  return {
    key,
    pair: pair ? { ...pair } : null,
    generation,
    status: pair ? "loading" : "idle",
    outcome: null,
    previous,
  };
}

export function useStockLookup(
  pair: StockPair | null,
  read: (pair: StockPair) => Promise<StockOutcome>,
) {
  const key = pair ? JSON.stringify([pair.productId, pair.locationId]) : null;
  const [stored, setState] = useState(() => startLookup(key, pair, 0));
  const readPair = useEffectEvent(read);

  let state = stored;
  if (stored.key !== key) {
    // Clear the prior pair's result before rendering the new selection.
    state = startLookup(key, pair, stored.generation + 1);
    setState(state);
  }

  useEffect(() => {
    if (state.status !== "loading" || !state.pair) {
      return;
    }

    const { pair, generation } = state;
    let active = true;

    function finish(outcome: StockOutcome) {
      if (!active) {
        return;
      }

      setState((current) => {
        if (current.generation !== generation || current.status !== "loading") {
          return current;
        }

        return {
          ...current,
          status: "result",
          outcome,
          previous: outcome.kind === "error" ? current.previous : null,
        };
      });
    }

    async function run(pair: StockPair) {
      try {
        finish(await readPair(pair));
      } catch {
        finish({ kind: "error" });
      }
    }

    void run(pair);
    return () => {
      active = false;
    };
  }, [state]);

  const refresh = useCallback(() => {
    setState((current) => {
      const { key, pair, outcome, generation, previous } = current;
      if (
        !pair ||
        !outcome ||
        outcome.kind === "denied" ||
        outcome.kind === "invalid"
      ) {
        return current;
      }

      return startLookup(
        key,
        pair,
        generation + 1,
        outcome.kind === "balance" ? outcome.balance : previous,
      );
    });
  }, []);

  return {
    status: state.status,
    outcome: state.outcome,
    previous: state.previous,
    refresh,
  };
}
