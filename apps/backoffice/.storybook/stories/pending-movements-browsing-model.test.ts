import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  type PendingPage,
  type PendingReadInput,
  type PendingReadOutcome,
  type PendingScope,
  usePendingMovementsBrowsing,
} from "./pending-movements-browsing-model";
import {
  pendingFixtureRows,
  readPendingFixturePage,
} from "./pending-movements-browsing-model-fixtures";

const all: PendingReadInput = { scope: "all", size: 50 };
const next: PendingReadInput = { ...all, token: "next-token" };
const previous: PendingReadInput = { ...all, token: "previous-token" };
const firstPage: PendingPage = {
  rows: [
    {
      reference: "row-a",
      kind: "receipt",
      location: "stockroom",
      product: null,
      quantity: "0.123456789",
      unit: null,
      reasons: ["product-unresolved", "unit-unresolved"],
    },
  ],
  next: "next-token",
  estimate: 102,
};
const secondPage: PendingPage = {
  rows: [
    {
      reference: "row-b",
      kind: "departure",
      location: "sales-floor",
      product: "Manzana reineta",
      quantity: null,
      unit: "kg",
      reasons: ["quantity-rules"],
    },
  ],
  previous: "previous-token",
};

type Configuration = Pick<PendingReadInput, "size"> & {
  scope: PendingScope | null;
  accessKey?: string;
};

function setup(configuration: Configuration = all) {
  const requests: {
    input: PendingReadInput;
    resolve: (outcome: PendingReadOutcome) => void;
    reject: (error: Error) => void;
  }[] = [];
  const read = vi.fn(
    (input: PendingReadInput) =>
      new Promise<PendingReadOutcome>((resolve, reject) => {
        requests.push({ input, resolve, reject });
      }),
  );
  const renders: ReturnType<typeof usePendingMovementsBrowsing>[] = [];
  const view = renderHook(
    (props: Configuration) => {
      const browsing = usePendingMovementsBrowsing({
        ...props,
        read: (input) => read(input),
      });
      renders.push(browsing);
      return browsing;
    },
    { initialProps: configuration },
  );

  return {
    ...view,
    requests,
    read,
    renders,
    respond: (index: number, outcome: PendingReadOutcome) =>
      act(async () => requests[index].resolve(outcome)),
    fail: (index: number) =>
      act(async () => requests[index].reject(new Error("Network interrupted"))),
  };
}

describe("pending movement list", () => {
  it("waits for a scope and advances the position only when a page loads", async () => {
    const view = setup({ scope: null, size: 50 });
    expect(view.result.current.status).toBe("choose");
    expect(view.requests).toHaveLength(0);

    view.rerender(all);
    expect(view.result.current).toMatchObject({
      status: "loading",
      result: null,
    });
    expect(view.read).toHaveBeenCalledExactlyOnceWith(all);
    await view.respond(0, { kind: "success", page: firstPage });
    expect(view.result.current).toMatchObject({
      status: "ready",
      result: { page: firstPage, position: 1 },
      canPrevious: false,
      canNext: true,
      previousResults: false,
    });

    act(() => {
      view.result.current.next();
      view.result.current.next();
    });
    expect(view.read).toHaveBeenLastCalledWith(next);
    expect(view.requests).toHaveLength(2);
    expect(view.result.current).toMatchObject({
      status: "loading",
      result: { page: firstPage, position: 1 },
      previousResults: true,
    });

    await view.respond(1, { kind: "success", page: secondPage });
    expect(view.result.current).toMatchObject({
      status: "ready",
      result: { page: secondPage, position: 2 },
      canPrevious: true,
      canNext: false,
    });
    act(() => view.result.current.previous());
    expect(view.read).toHaveBeenLastCalledWith(previous);
    await view.respond(2, { kind: "success", page: firstPage });
    expect(view.result.current.result?.position).toBe(1);
  });

  it("retries the unchanged failed request and removes results on access rejection", async () => {
    const view = setup();
    await view.respond(0, { kind: "success", page: firstPage });
    act(() => view.result.current.next());
    await view.fail(1);
    expect(view.result.current).toMatchObject({
      status: "error",
      result: { page: firstPage, position: 1 },
      previousResults: true,
      canRestart: false,
    });
    expect(view.requests).toHaveLength(2);

    act(() => view.result.current.retry());
    expect(view.requests[2].input).toEqual(view.requests[1].input);
    await view.respond(2, { kind: "denied" });
    expect(view.result.current).toMatchObject({
      status: "denied",
      result: null,
      previousResults: false,
      canRestart: false,
    });
  });

  it("allows a first-group retry after a technical failure with no previous result", async () => {
    const view = setup();
    await view.respond(0, { kind: "error" });
    expect(view.result.current).toMatchObject({
      status: "error",
      result: null,
      previousResults: false,
    });
    act(() => view.result.current.retry());
    expect(view.read).toHaveBeenLastCalledWith(all);
    await view.respond(1, { kind: "success", page: firstPage });
    expect(view.result.current.result?.position).toBe(1);
  });

  it.each([
    { response: { kind: "rejected" }, status: "rejected" },
    {
      response: { kind: "success", page: { rows: [], estimate: 40 } },
      status: "empty-continuation",
    },
  ] as const)(
    "retains the reached page and offers an explicit restart on $status",
    async ({ response, status }) => {
      const view = setup();
      await view.respond(0, { kind: "success", page: firstPage });
      act(() => view.result.current.next());
      await view.respond(1, { kind: "success", page: secondPage });
      act(() => view.result.current.previous());
      await view.respond(2, response);
      expect(view.result.current).toMatchObject({
        status,
        result: { page: secondPage, position: 2 },
        previousResults: true,
        canPrevious: false,
        canRestart: true,
      });

      act(() => {
        view.result.current.retry();
        view.result.current.previous();
      });
      expect(view.requests).toHaveLength(3);
      act(() => view.result.current.restart());
      expect(view.read).toHaveBeenLastCalledWith(all);
      expect(view.result.current.result?.position).toBe(2);
      await view.respond(3, { kind: "success", page: firstPage });
      expect(view.result.current.result?.position).toBe(1);
      expect(view.result.current.canRestart).toBe(false);
    },
  );

  it("refreshes the exact reached input and shows a confirmed empty current continuation", async () => {
    const view = setup();
    await view.respond(0, { kind: "success", page: firstPage });
    act(() => view.result.current.next());
    await view.respond(1, { kind: "success", page: secondPage });
    act(() => view.result.current.refresh());
    expect(view.read).toHaveBeenLastCalledWith(next);
    expect(view.result.current.previousResults).toBe(true);

    const emptyPage: PendingPage = { rows: [], estimate: 50 };
    await view.respond(2, { kind: "success", page: emptyPage });
    expect(view.result.current).toMatchObject({
      status: "empty-continuation",
      result: { page: emptyPage, position: 2 },
      previousResults: false,
      canRestart: true,
    });
    act(() => view.result.current.restart());
    await view.respond(3, { kind: "success", page: { rows: [] } });
    expect(view.result.current).toMatchObject({
      status: "ready",
      result: { page: { rows: [] }, position: 1 },
      previousResults: false,
      canRestart: false,
    });
  });

  it("replaces an inspected row only after a successful read for the reached page", async () => {
    const view = setup();
    await view.respond(0, { kind: "success", page: firstPage });
    act(() => view.result.current.next());
    await view.respond(1, { kind: "success", page: secondPage });
    act(() => view.result.current.refresh());
    expect(view.read).toHaveBeenLastCalledWith(next);

    const updated = { ...secondPage, rows: firstPage.rows };
    await view.respond(2, { kind: "success", page: updated });
    expect(view.result.current).toMatchObject({
      status: "ready",
      result: { page: updated, position: 2 },
      previousResults: false,
    });
  });

  it("discards the old rows and delayed replies immediately when scope or known access changes", async () => {
    const view = setup();
    await view.respond(0, { kind: "success", page: firstPage });
    act(() => view.result.current.next());
    const before = view.renders.length;
    view.rerender({ scope: "stockroom", size: 50 });
    expect(view.renders[before]).toMatchObject({
      status: "loading",
      result: null,
    });
    await view.respond(1, { kind: "success", page: secondPage });
    expect(view.result.current).toMatchObject({
      status: "loading",
      result: null,
    });
    await view.respond(2, { kind: "success", page: firstPage });

    act(() => view.result.current.next());
    view.rerender({ scope: "stockroom", size: 50, accessKey: "changed" });
    await view.respond(3, { kind: "success", page: secondPage });
    expect(view.result.current).toMatchObject({
      status: "loading",
      result: null,
    });
    expect(view.read).toHaveBeenLastCalledWith({
      scope: "stockroom",
      size: 50,
    });
    await view.respond(4, { kind: "denied" });
    expect(view.result.current.status).toBe("denied");
  });

  it("starts a new first-group request at the chosen size", async () => {
    const view = setup();
    await view.respond(0, { kind: "success", page: firstPage });
    act(() => view.result.current.next());
    await view.respond(1, { kind: "success", page: secondPage });
    view.rerender({ ...all, size: 25 });
    expect(view.read).toHaveBeenLastCalledWith({ scope: "all", size: 25 });
    expect(view.result.current.previousResults).toBe(true);
    await view.respond(2, { kind: "success", page: firstPage });
    expect(view.result.current.result?.position).toBe(1);
  });

  it("keeps the chosen size when an inspector closes over a page retained during the size change", async () => {
    const view = setup();
    await view.respond(0, { kind: "success", page: firstPage });
    act(() => view.result.current.next());
    await view.respond(1, { kind: "success", page: secondPage });
    view.rerender({ ...all, size: 25 });
    await view.respond(2, { kind: "error" });

    act(() => view.result.current.refresh());
    expect(view.read).toHaveBeenLastCalledWith({ scope: "all", size: 25 });
    expect(view.result.current.result?.position).toBe(2);
    await view.respond(3, { kind: "success", page: firstPage });
    expect(view.result.current.result?.position).toBe(1);
  });
});

describe("simulated pending movement read", () => {
  it("returns deterministic scoped results and opaque direction tokens", () => {
    const first = readPendingFixturePage(all);
    expect(first.kind).toBe("success");
    if (first.kind !== "success") throw new Error("Expected a fixture page");
    expect(first.page.rows).toHaveLength(50);
    expect(first.page.next).toBeDefined();
    expect(first.page.previous).toBeUndefined();
    expect(first.page.rows[0].quantity).toBe("0.123456789");
    expect(first.page.rows[2]).toMatchObject({
      product: null,
      quantity: "12",
      unit: null,
    });
    expect(first.page.rows[3]).toMatchObject({ quantity: null, unit: "piece" });

    const second = readPendingFixturePage({ ...all, token: first.page.next });
    if (second.kind !== "success") throw new Error("Expected a continuation");
    expect(second.page.rows[0].reference).not.toBe(
      first.page.rows[0].reference,
    );
    expect(
      readPendingFixturePage({ ...all, token: second.page.previous }),
    ).toEqual(first);
    expect(
      readPendingFixturePage({
        scope: "stockroom",
        size: 50,
        token: first.page.next,
      }),
    ).toEqual({ kind: "rejected" });
    expect(
      readPendingFixturePage({ ...all, size: 25, token: first.page.next }),
    ).toEqual({ kind: "rejected" });
    expect(readPendingFixturePage({ ...all, token: "unknown" })).toEqual({
      kind: "rejected",
    });
  });

  it("uses current access and preserves authorization and estimate as separate facts", () => {
    const stockroom = { scope: "stockroom", size: 100 } as const;
    const result = readPendingFixturePage(stockroom, { showEstimate: false });
    if (result.kind !== "success") throw new Error("Expected a scoped page");
    expect(result.page.rows).toHaveLength(100);
    expect(
      result.page.rows.every(({ location }) => location === "stockroom"),
    ).toBe(true);
    expect(result.page.next).toBeDefined();
    expect(result.page.estimate).toBeUndefined();
    expect(
      readPendingFixturePage(stockroom, {
        authorizedLocations: ["sales-floor"],
      }),
    ).toEqual({ kind: "denied" });
    expect(readPendingFixturePage(all, { authorizedLocations: [] })).toEqual({
      kind: "success",
      page: { rows: [], estimate: 0 },
    });
  });

  it("returns an authorized empty continuation even if preceding pending lines remain", () => {
    const first = readPendingFixturePage(all);
    if (first.kind !== "success") throw new Error("Expected a fixture page");
    const exclude = new Set(
      pendingFixtureRows.slice(49).map((line) => line.reference),
    );
    expect(
      readPendingFixturePage({ ...all, token: first.page.next }, { exclude }),
    ).toEqual({
      kind: "success",
      page: { rows: [], estimate: 49 },
    });
  });
});
