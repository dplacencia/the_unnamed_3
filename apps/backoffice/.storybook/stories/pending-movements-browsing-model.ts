import { useEffect, useEffectEvent, useState } from "react";
import type { CreationUnitId } from "./products-creation-model";

export type PendingLocation = "sales-floor" | "stockroom";
export type PendingScope = PendingLocation | "all";
export type PendingPageSize = 25 | 50 | 100;

export type PendingLine = {
  reference: string;
  location: PendingLocation;
  product: string | null;
  quantity: string | null;
  unit: CreationUnitId | null;
  reasons: readonly string[];
} & ({ kind: "receipt" } | { kind: "departure"; channel: string | null });

export type PendingPage = {
  rows: readonly PendingLine[];
  previous?: string;
  next?: string;
  estimate?: number;
};

export type PendingReadInput = {
  scope: PendingScope;
  size: PendingPageSize;
  token?: string;
};

export type PendingReadOutcome =
  | { kind: "success"; page: PendingPage }
  | { kind: "error" }
  | { kind: "denied" }
  | { kind: "rejected" };

export type PendingRead = (
  input: PendingReadInput,
) => Promise<PendingReadOutcome>;

type Context = {
  scope: PendingScope | null;
  size: PendingPageSize;
  accessKey?: string;
};

type Direction = "previous" | "next";
type Request = {
  input: PendingReadInput;
  position: number;
  action: "first" | Direction | "refresh";
};
type Result = { page: PendingPage; position: number; input: PendingReadInput };
type Status =
  | "choose"
  | "loading"
  | "ready"
  | "error"
  | "denied"
  | "rejected"
  | "empty-continuation";
type View = {
  context: Context;
  status: Status;
  request: Request | null;
  result: Result | null;
  previousResults: boolean;
};

function firstRequest(context: Context, result: Result | null = null): View {
  const { scope, size } = context;
  return {
    context,
    status: scope ? "loading" : "choose",
    request: scope
      ? { input: { scope, size }, position: 1, action: "first" }
      : null,
    result,
    previousResults: result !== null,
  };
}

function begin(view: View, request: Request): View {
  return {
    ...view,
    request,
    status: "loading",
    previousResults: view.result !== null,
  };
}

function complete(
  view: View,
  request: Request,
  outcome: PendingReadOutcome,
): View {
  switch (outcome.kind) {
    case "denied":
      return {
        ...view,
        status: "denied",
        result: null,
        previousResults: false,
      };
    case "error":
      return { ...view, status: "error" };
    case "rejected":
      return { ...view, status: request.input.token ? "rejected" : "error" };
    case "success": {
      const emptyContinuation =
        request.input.token !== undefined && outcome.page.rows.length === 0;
      if (emptyContinuation && request.action !== "refresh") {
        return { ...view, status: "empty-continuation" };
      }
      return {
        ...view,
        status: emptyContinuation ? "empty-continuation" : "ready",
        result: {
          page: outcome.page,
          position: request.position,
          input: request.input,
        },
        previousResults: false,
      };
    }
  }
}

function continuation(view: View, direction: Direction) {
  const mayNavigate =
    view.status === "ready" ||
    (isUnavailable(view.status) &&
      view.request?.action !== "refresh" &&
      view.request?.action !== direction);
  if (
    mayNavigate &&
    (direction === "next" || (view.result?.position ?? 0) > 1)
  ) {
    return view.result?.page[direction];
  }
}

function isUnavailable(status: Status) {
  return status === "rejected" || status === "empty-continuation";
}

export function usePendingMovementsBrowsing({
  read,
  ...context
}: Context & { read: PendingRead }) {
  const [stored, setView] = useState(() => firstRequest(context));
  const readPage = useEffectEvent(read);
  const scopeChanged =
    stored.context.scope !== context.scope ||
    stored.context.accessKey !== context.accessKey;

  let view = stored;
  if (scopeChanged || stored.context.size !== context.size) {
    // Keep the old snapshot only when the requested scope still matches it.
    view = firstRequest(context, scopeChanged ? null : stored.result);
    setView(view);
  }
  const { request, status } = view;

  useEffect(() => {
    if (status !== "loading" || request === null) return;

    let active = true;
    async function run(attempt: Request) {
      let outcome: PendingReadOutcome;
      try {
        outcome = await readPage(attempt.input);
      } catch {
        outcome = { kind: "error" };
      }
      if (active) {
        setView((current) =>
          current.request === attempt
            ? complete(current, attempt, outcome)
            : current,
        );
      }
    }

    void run(request);
    return () => {
      active = false;
    };
  }, [request, status]);

  function navigate(direction: Direction) {
    setView((current) => {
      const token = continuation(current, direction);
      const { result } = current;
      if (!token || !result) return current;
      return begin(current, {
        input: { ...result.input, token },
        position: result.position + (direction === "next" ? 1 : -1),
        action: direction,
      });
    });
  }

  function refresh() {
    setView((current) => {
      const { result, request, status } = current;
      if (!result || (status === "loading" && request?.action === "refresh")) {
        return current;
      }
      const size = current.context.size;
      const sameSize = result.input.size === size;
      return begin(current, {
        input: sameSize ? result.input : { scope: result.input.scope, size },
        position: sameSize ? result.position : 1,
        action: "refresh",
      });
    });
  }

  return {
    status,
    result: view.result,
    previousResults: view.previousResults,
    canPrevious: continuation(view, "previous") !== undefined,
    canNext: continuation(view, "next") !== undefined,
    canRestart: isUnavailable(status),
    previous: () => navigate("previous"),
    next: () => navigate("next"),
    retry: () =>
      setView((current) =>
        current.status === "error" && current.request
          ? begin(current, { ...current.request })
          : current,
      ),
    restart: () =>
      setView((current) =>
        isUnavailable(current.status)
          ? firstRequest(current.context, current.result)
          : current,
      ),
    refresh,
  };
}
