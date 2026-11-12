import { vi } from "vitest";

export function installMediaQueries(width = 1440, dark = false) {
  const entries = new Map<
    string,
    {
      matches: boolean;
      listeners: Set<(event: MediaQueryListEvent) => void>;
      api: MediaQueryList;
    }
  >();

  const matches = (query: string) => {
    if (query === "(prefers-color-scheme: dark)") return dark;
    const maximum = query.match(/max-width:\s*(\d+)px/);
    return maximum ? width <= Number(maximum[1]) : false;
  };

  vi.stubGlobal("matchMedia", (query: string) => {
    if (!entries.has(query)) {
      const entry = {
        matches: matches(query),
        listeners: new Set<(event: MediaQueryListEvent) => void>(),
        api: {} as MediaQueryList,
      };
      entry.api = {
        media: query,
        get matches() {
          return entry.matches;
        },
        onchange: null,
        addEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => entry.listeners.add(listener),
        removeEventListener: (
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => entry.listeners.delete(listener),
        addListener: (listener: (event: MediaQueryListEvent) => void) =>
          entry.listeners.add(listener),
        removeListener: (listener: (event: MediaQueryListEvent) => void) =>
          entry.listeners.delete(listener),
        dispatchEvent: () => true,
      } as MediaQueryList;
      entries.set(query, entry);
    }
    return entries.get(query)!.api;
  });

  const update = () => {
    Object.defineProperty(window, "innerWidth", {
      value: width,
      configurable: true,
    });
    for (const [query, entry] of entries) {
      const next = matches(query);
      if (next !== entry.matches) {
        entry.matches = next;
        const event = Object.assign(new Event("change"), {
          matches: next,
          media: query,
        });
        entry.listeners.forEach((listener) =>
          listener(event as MediaQueryListEvent),
        );
      }
    }
  };
  update();

  return {
    setWidth(next: number) {
      width = next;
      update();
    },
    setDark(next: boolean) {
      dark = next;
      update();
    },
  };
}
