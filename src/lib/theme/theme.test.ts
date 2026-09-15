import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  cycleTheme,
  getSystemTheme,
  isTheme,
  resolveTheme,
  themeInitScript,
} from "./theme";

function mockMatchMedia(matchesDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matchesDark && query.includes("prefers-color-scheme: dark"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("theme", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("isTheme", () => {
    it("aceita light, dark e system", () => {
      expect(isTheme("light")).toBe(true);
      expect(isTheme("dark")).toBe(true);
      expect(isTheme("system")).toBe(true);
    });

    it("rejeita valores inválidos", () => {
      expect(isTheme("auto")).toBe(false);
      expect(isTheme("")).toBe(false);
      expect(isTheme(null)).toBe(false);
      expect(isTheme(undefined)).toBe(false);
    });
  });

  describe("cycleTheme", () => {
    it("cicla light → dark → system → light", () => {
      expect(cycleTheme("light")).toBe("dark");
      expect(cycleTheme("dark")).toBe("system");
      expect(cycleTheme("system")).toBe("light");
    });
  });

  describe("getSystemTheme / resolveTheme", () => {
    it("resolve system para light quando o SO não está em dark", () => {
      mockMatchMedia(false);
      expect(getSystemTheme()).toBe("light");
      expect(resolveTheme("system")).toBe("light");
    });

    it("resolve system para dark quando o SO está em dark", () => {
      mockMatchMedia(true);
      expect(getSystemTheme()).toBe("dark");
      expect(resolveTheme("system")).toBe("dark");
    });

    it("mantém light e dark sem consultar o SO", () => {
      mockMatchMedia(true);
      expect(resolveTheme("light")).toBe("light");
      expect(resolveTheme("dark")).toBe("dark");
    });
  });

  describe("applyTheme", () => {
    it("define data-theme e color-scheme no documentElement", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });

    it("resolve system antes de aplicar", () => {
      mockMatchMedia(true);
      applyTheme("system");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });
  });

  describe("themeInitScript", () => {
    it("usa a key de storage correta", () => {
      expect(themeInitScript).toContain(THEME_STORAGE_KEY);
    });
  });

  describe("withViewTransition", () => {
    it("chama startViewTransition quando disponível", async () => {
      const { withViewTransition } = await import("./theme");
      const update = vi.fn();
      const startViewTransition = vi.fn((cb: () => void) => {
        cb();
        return { finished: Promise.resolve(), ready: Promise.resolve(), updateCallbackDone: Promise.resolve(), skipTransition: vi.fn() };
      });

      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        writable: true,
        value: startViewTransition,
      });
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: vi.fn().mockReturnValue({ matches: false }),
      });

      withViewTransition(update);

      expect(startViewTransition).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledTimes(1);
    });

    it("aplica direto quando prefers-reduced-motion", async () => {
      const { withViewTransition } = await import("./theme");
      const update = vi.fn();
      const startViewTransition = vi.fn();

      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        writable: true,
        value: startViewTransition,
      });
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes("prefers-reduced-motion: reduce"),
        })),
      });

      withViewTransition(update);

      expect(startViewTransition).not.toHaveBeenCalled();
      expect(update).toHaveBeenCalledTimes(1);
    });
  });
});
