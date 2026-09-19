import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    THEME_STORAGE_KEY,
    getServerThemeSnapshot,
    getThemeSnapshot,
    readStoredTheme,
    setStoredTheme,
    subscribeTheme,
} from "./index";
import { handleStorageEventForTests } from "./store";

function mockLocalStorage() {
    const store = new Map<string, string>();

    Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => {
                store.set(key, value);
            },
            removeItem: (key: string) => {
                store.delete(key);
            },
            clear: () => {
                store.clear();
            },
            key: (index: number) => [...store.keys()][index] ?? null,
            get length() {
                return store.size;
            },
        },
    });
}

describe("theme store", () => {
    beforeEach(() => {
        mockLocalStorage();
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.style.colorScheme = "";
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            configurable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("readStoredTheme retorna system quando não há valor", () => {
        expect(readStoredTheme()).toBe("system");
    });

    it("readStoredTheme lê valor válido do localStorage", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "dark");
        expect(readStoredTheme()).toBe("dark");
        expect(getThemeSnapshot()).toBe("dark");
    });

    it("readStoredTheme ignora valor inválido e volta para system", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "neon");
        expect(readStoredTheme()).toBe("system");
    });

    it("getServerThemeSnapshot sempre retorna system", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "dark");
        expect(getServerThemeSnapshot()).toBe("system");
    });

    it("setStoredTheme persiste, aplica no DOM e notifica listeners", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeTheme(listener);

        setStoredTheme("light");

        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
        expect(document.documentElement.getAttribute("data-theme")).toBe(
            "light",
        );
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();
        setStoredTheme("dark");
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("sincroniza tema quando outra janela altera o localStorage", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeTheme(listener);

        localStorage.setItem(THEME_STORAGE_KEY, "dark");
        handleStorageEventForTests({
            key: THEME_STORAGE_KEY,
            newValue: "dark",
        } as StorageEvent);

        expect(document.documentElement.getAttribute("data-theme")).toBe(
            "dark",
        );
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();
    });
});
