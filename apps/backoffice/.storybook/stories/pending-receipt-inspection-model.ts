import { useCallback, useEffect, useEffectEvent, useState } from "react";
import type { CreationUnitId } from "./products-creation-model";

export type InspectionDetail = {
  product: string | null;
  location: string;
  quantity: string | null;
  unit: CreationUnitId | null;
  outcome:
    | { kind: "pending"; reasons: readonly string[] }
    | { kind: "applied"; effect: { quantity: string; unit: CreationUnitId } }
    | { kind: "rejected"; reason?: string };
};

export type InspectionOutcome =
  | { kind: "found"; detail: InspectionDetail }
  | { kind: "unavailable" }
  | { kind: "error" };

export type InspectionRead = (
  lineReference: string,
) => Promise<InspectionOutcome>;

type InspectionState = InspectionOutcome | { kind: "loading" };

type InspectionAttempt = {
  lineReference: string;
  state: InspectionState;
};

function loading(lineReference: string): InspectionAttempt {
  return { lineReference, state: { kind: "loading" } };
}

export function usePendingReceiptInspection(
  lineReference: string,
  read: InspectionRead,
): { state: InspectionState; refresh: () => void } {
  const [stored, setAttempt] = useState(() => loading(lineReference));
  const readLine = useEffectEvent(read);

  let attempt = stored;
  if (stored.lineReference !== lineReference) {
    // The old line's details must not render with the new reference.
    attempt = loading(lineReference);
    setAttempt(attempt);
  }

  useEffect(() => {
    if (attempt.state.kind !== "loading") return;

    let active = true;
    async function request() {
      let state: InspectionOutcome;
      try {
        state = await readLine(attempt.lineReference);
      } catch {
        state = { kind: "error" };
      }

      if (active) {
        setAttempt((current) =>
          current === attempt ? { ...attempt, state } : current,
        );
      }
    }

    void request();
    return () => {
      active = false;
    };
  }, [attempt]);

  const refresh = useCallback(() => {
    setAttempt((current) =>
      current.state.kind === "found" || current.state.kind === "error"
        ? loading(current.lineReference)
        : current,
    );
  }, []);

  return { state: attempt.state, refresh };
}
