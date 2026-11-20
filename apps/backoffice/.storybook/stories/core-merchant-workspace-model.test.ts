import { describe, expect, it } from "vitest";
import {
  checkedReadiness,
  createMerchantRequest,
  createMerchantWithCreatorRequest,
  creationResult,
  merchantDiscoveryPage,
} from "./core-merchant-workspace-model";

describe("Core merchant workspace", () => {
  it("keeps the original name and enforces the UTF-8 limit", () => {
    const name = "  Frutería del barrio  ";
    expect(createMerchantRequest(name, "request-1")).toEqual({
      caller_operation_id: "request-1",
      name,
    });
    expect(createMerchantRequest(" ".repeat(8), "request-1")).toBeNull();
    expect(createMerchantRequest("á".repeat(127), "request-1")).not.toBeNull();
    expect(createMerchantRequest("á".repeat(128), "request-1")).toBeNull();
  });

  it("preserves an uncertain request and distinguishes response states", () => {
    const request = createMerchantRequest("Mi comercio", "request-2")!;
    expect(creationResult(request, undefined)).toEqual({
      kind: "creation-unconfirmed",
      request,
    });
    for (const state of ["pending", "blocked", "ready"] as const) {
      expect(
        creationResult(request, { merchant_id: "merchant-created", state }),
      ).toEqual({
        kind: "creation",
        request,
        merchantId: "merchant-created",
        state,
      });
    }
  });

  it("requires a matching readiness ID before accepting a ready response", () => {
    const request = createMerchantRequest("Mi comercio", "request-3")!;
    const pending = {
      kind: "creation",
      request,
      merchantId: "merchant-created",
      state: "pending",
    } as const;
    expect(checkedReadiness(pending, undefined)).toEqual({
      ...pending,
      state: "unavailable",
    });
    expect(
      checkedReadiness(pending, { merchant_id: "other", state: "ready" }),
    ).toEqual({ ...pending, state: "unavailable" });
    expect(
      checkedReadiness(pending, {
        merchant_id: "merchant-created",
        state: "ready",
      }),
    ).toEqual({ ...pending, state: "ready" });
  });

  it("distinguishes empty discovery from failed and follows opaque tokens", () => {
    const first = merchantDiscoveryPage();
    expect(first?.merchants.map((entry) => entry.merchant_id)).toEqual([
      "merchant-huerta",
      "merchant-plaza",
    ]);
    const next = first?.page.next_page_token;
    expect(next).toBeDefined();
    const second = merchantDiscoveryPage(next);
    expect(second?.merchants.map((entry) => entry.merchant_id)).toEqual([
      "merchant-mercado",
    ]);
    expect(merchantDiscoveryPage(second?.page.previous_page_token)).toEqual(
      first,
    );
    expect(merchantDiscoveryPage("expired")).toBeUndefined();
    expect(merchantDiscoveryPage(undefined, true)).toEqual({
      merchants: [],
      page: {},
    });
  });

  it("validates reviewed creator data under the separate Core contract", () => {
    const supplied = "  Ágata  ";
    expect(
      createMerchantWithCreatorRequest(
        "  La Huerta ",
        "request-4",
        supplied,
        null,
      ),
    ).toEqual({
      caller_operation_id: "request-4",
      name: "  La Huerta ",
      creator: { first_name: supplied, last_name: null },
    });
    expect(
      createMerchantWithCreatorRequest("La Huerta", "request-4", "Ana", " "),
    ).toBeNull();
    expect(
      createMerchantWithCreatorRequest(
        "La Huerta",
        "request-4",
        "A\u0085na",
        null,
      ),
    ).toBeNull();
    expect(
      createMerchantWithCreatorRequest(
        "La Huerta",
        "request-4",
        "😀".repeat(255),
        "Sol",
      ),
    ).not.toBeNull();
    expect(
      createMerchantWithCreatorRequest(
        "La Huerta",
        "request-4",
        "😀".repeat(256),
        "Sol",
      ),
    ).toBeNull();
    expect(
      createMerchantWithCreatorRequest(
        "La Huerta",
        "request-4",
        " ".repeat(4096) + "A",
        null,
      ),
    ).toBeNull();
  });
});
