import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { installMediaQueries } from "@/test/media-queries";
import { SidebarProvider, useSidebar } from "./sidebar";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("@/i18n/navigation", () => ({ usePathname: () => route.pathname }));

function Probe() {
  const { open, openMobile, toggleSidebar } = useSidebar();
  return (
    <>
      <output aria-label="Desktop sidebar">{String(open)}</output>
      <output aria-label="Mobile sidebar">{String(openMobile)}</output>
      <button onClick={toggleSidebar}>Toggle sidebar</button>
    </>
  );
}
const tree = () => (
  <SidebarProvider>
    <Probe />
  </SidebarProvider>
);

describe("retained TailAdmin sidebar behavior", () => {
  beforeEach(() => {
    route.pathname = "/";
  });

  it("toggles the desktop sidebar using its existing state contract", () => {
    installMediaQueries(1440);
    render(tree());
    expect(screen.getByLabelText("Desktop sidebar").textContent).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(screen.getByLabelText("Desktop sidebar").textContent).toBe("false");
    expect(document.cookie).toContain("sidebar_state=false");
  });

  it("closes the mobile sidebar on navigation and keeps it closed on return", () => {
    installMediaQueries(800);
    const { rerender } = render(tree());
    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(screen.getByLabelText("Mobile sidebar").textContent).toBe("true");
    route.pathname = "/another-route";
    rerender(tree());
    expect(screen.getByLabelText("Mobile sidebar").textContent).toBe("false");
    route.pathname = "/";
    rerender(tree());
    expect(screen.getByLabelText("Mobile sidebar").textContent).toBe("false");
  });
});
