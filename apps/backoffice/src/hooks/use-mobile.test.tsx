import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { installMediaQueries } from "@/test/media-queries";
import { useIsMobile } from "./use-mobile";

describe("TailAdmin mobile breakpoint", () => {
  it("switches at the existing 1280px shell boundary", () => {
    const media = installMediaQueries(1279);
    const { result } = renderHook(useIsMobile);
    expect(result.current).toBe(true);
    act(() => media.setWidth(1280));
    expect(result.current).toBe(false);
    act(() => media.setWidth(800));
    expect(result.current).toBe(true);
  });

  it("uses a stable desktop snapshot during server rendering", () => {
    installMediaQueries(800);
    function Probe() {
      return <output>{String(useIsMobile())}</output>;
    }
    expect(renderToString(<Probe />)).toContain("false");
  });
});
