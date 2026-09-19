import { describe, expect, it } from "vitest";
import {
  isLocale,
  resolveBrowserLocale,
  swapLocale,
  withLocale,
} from "./locale";
import { translate } from "./messages";
import en from "@/lang/en.json";

describe("resolveBrowserLocale", () => {
  it("maps Portuguese browser languages to pt", () => {
    expect(resolveBrowserLocale("pt")).toBe("pt");
    expect(resolveBrowserLocale("pt-BR")).toBe("pt");
    expect(resolveBrowserLocale("pt-PT")).toBe("pt");
  });

  it("maps non-Portuguese browser languages to en", () => {
    expect(resolveBrowserLocale("en")).toBe("en");
    expect(resolveBrowserLocale("en-US")).toBe("en");
    expect(resolveBrowserLocale("es-ES")).toBe("en");
  });
});

describe("isLocale", () => {
  it("accepts en and pt only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("pt")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("auto")).toBe(false);
  });
});

describe("withLocale / swapLocale", () => {
  it("prefixes paths with locale", () => {
    expect(withLocale("en")).toBe("/en");
    expect(withLocale("pt", "/")).toBe("/pt");
    expect(withLocale("en", "/hobby")).toBe("/en/hobby");
    expect(withLocale("pt", "/en/hobby")).toBe("/pt/hobby");
  });

  it("swaps the locale segment", () => {
    expect(swapLocale("/en", "pt")).toBe("/pt");
    expect(swapLocale("/en/hobby", "pt")).toBe("/pt/hobby");
    expect(swapLocale("/hobby", "en")).toBe("/en/hobby");
  });
});

describe("translate", () => {
  it("resolves nested keys and interpolates params", () => {
    expect(translate(en, "language.automatic")).toBe("Automatic");
    expect(
      translate(en, "language.browserLanguage", { language: "English" }),
    ).toBe("Browser language · English");
  });

  it("returns the key when missing", () => {
    expect(translate(en, "missing.key")).toBe("missing.key");
  });
});
