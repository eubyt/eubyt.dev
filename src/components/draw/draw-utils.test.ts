import { describe, expect, it } from "vitest";
import {
    DEFAULT_DRAW_COLOR,
    STROKE_SIZES,
    clampRgb,
    getStrokeWidth,
    getToolStrokeWidth,
    hexToRgb,
    hsvToHex,
    hsvToRgb,
    isDrawTool,
    isHexColor,
    isStrokeSize,
    normalizeHexColor,
    rgbToHex,
    rgbToHsv,
} from "./draw-utils";

describe("draw-utils", () => {
    describe("isStrokeSize", () => {
        it("aceita fine, medium e thick", () => {
            expect(isStrokeSize("fine")).toBe(true);
            expect(isStrokeSize("medium")).toBe(true);
            expect(isStrokeSize("thick")).toBe(true);
        });

        it("rejeita valores inválidos", () => {
            expect(isStrokeSize("huge")).toBe(false);
            expect(isStrokeSize("")).toBe(false);
            expect(isStrokeSize(5)).toBe(false);
            expect(isStrokeSize(null)).toBe(false);
        });
    });

    describe("isDrawTool / getToolStrokeWidth", () => {
        it("aceita pen e eraser", () => {
            expect(isDrawTool("pen")).toBe(true);
            expect(isDrawTool("eraser")).toBe(true);
            expect(isDrawTool("fill")).toBe(false);
        });

        it("borracha usa traço maior que o pincel no mesmo preset", () => {
            expect(getToolStrokeWidth("eraser", "medium")).toBeGreaterThan(
                getToolStrokeWidth("pen", "medium"),
            );
            expect(getToolStrokeWidth("pen", "fine")).toBe(
                getStrokeWidth("fine"),
            );
        });
    });

    describe("getStrokeWidth", () => {
        it("mapeia presets para pixels", () => {
            expect(getStrokeWidth("fine")).toBe(STROKE_SIZES.fine);
            expect(getStrokeWidth("medium")).toBe(STROKE_SIZES.medium);
            expect(getStrokeWidth("thick")).toBe(STROKE_SIZES.thick);
        });

        it("mantém ordem crescente fino < médio < grosso", () => {
            expect(getStrokeWidth("fine")).toBeLessThan(
                getStrokeWidth("medium"),
            );
            expect(getStrokeWidth("medium")).toBeLessThan(
                getStrokeWidth("thick"),
            );
        });
    });

    describe("isHexColor / normalizeHexColor", () => {
        it("aceita #RGB e #RRGGBB", () => {
            expect(isHexColor("#abc")).toBe(true);
            expect(isHexColor("#a1b2c3")).toBe(true);
            expect(isHexColor("#GGG")).toBe(false);
            expect(isHexColor("red")).toBe(false);
        });

        it("expande #RGB para #RRGGBB em minúsculas", () => {
            expect(normalizeHexColor("#AbC")).toBe("#aabbcc");
            expect(normalizeHexColor("#FF5500")).toBe("#ff5500");
        });

        it("faz fallback para a cor padrão quando inválido", () => {
            expect(normalizeHexColor("azul")).toBe(DEFAULT_DRAW_COLOR);
        });
    });

    describe("hexToRgb / rgbToHex", () => {
        it("converte hex para canais RGB", () => {
            expect(hexToRgb("#ff5500")).toEqual({ r: 255, g: 85, b: 0 });
            expect(hexToRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
        });

        it("converte RGB para hex", () => {
            expect(rgbToHex({ r: 255, g: 85, b: 0 })).toBe("#ff5500");
        });

        it("é reversível para cores normalizadas", () => {
            const hex = "#0a1b2c";
            expect(rgbToHex(hexToRgb(hex))).toBe(hex);
        });

        it("clampa canais fora do intervalo 0–255", () => {
            expect(clampRgb({ r: -10, g: 300, b: 12.7 })).toEqual({
                r: 0,
                g: 255,
                b: 13,
            });
            expect(rgbToHex({ r: -10, g: 300, b: 12.7 })).toBe("#00ff0d");
        });
    });

    describe("rgbToHsv / hsvToRgb", () => {
        it("converte azul vivo para HSV", () => {
            const hsv = rgbToHsv({ r: 37, g: 99, b: 235 });
            expect(hsv.h).toBeGreaterThan(210);
            expect(hsv.h).toBeLessThan(230);
            expect(hsv.s).toBeGreaterThan(0.8);
            expect(hsv.v).toBeGreaterThan(0.9);
        });

        it("é aproximadamente reversível", () => {
            const original = { r: 37, g: 99, b: 235 };
            expect(hsvToRgb(rgbToHsv(original))).toEqual(original);
        });

        it("hsvToHex gera hex válido", () => {
            expect(hsvToHex({ h: 220, s: 1, v: 1 })).toMatch(/^#[0-9a-f]{6}$/);
        });

        it("preserva preto e branco", () => {
            expect(hsvToRgb({ h: 0, s: 0, v: 0 })).toEqual({
                r: 0,
                g: 0,
                b: 0,
            });
            expect(hsvToRgb({ h: 0, s: 0, v: 1 })).toEqual({
                r: 255,
                g: 255,
                b: 255,
            });
        });
    });
});
