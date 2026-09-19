export const STROKE_SIZES = {
    fine: 2,
    medium: 5,
    thick: 12,
} as const;

export type StrokeSize = keyof typeof STROKE_SIZES;

export const DRAW_TOOLS = ["pen", "eraser"] as const;

export type DrawTool = (typeof DRAW_TOOLS)[number];

export type RgbColor = {
    r: number;
    g: number;
    b: number;
};

export type HsvColor = {
    h: number;
    s: number;
    v: number;
};

export const DEFAULT_DRAW_COLOR = "#141414";

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isStrokeSize(value: unknown): value is StrokeSize {
    return typeof value === "string" && value in STROKE_SIZES;
}

export function isDrawTool(value: unknown): value is DrawTool {
    return typeof value === "string" && DRAW_TOOLS.includes(value as DrawTool);
}

export function getStrokeWidth(size: StrokeSize): number {
    return STROKE_SIZES[size];
}

/** Eraser feels slightly larger than the pen at the same preset. */
export function getToolStrokeWidth(tool: DrawTool, size: StrokeSize): number {
    const base = getStrokeWidth(size);
    return tool === "eraser" ? base * 1.6 : base;
}

export function isHexColor(value: unknown): value is string {
    return typeof value === "string" && HEX_COLOR_RE.test(value);
}

/** Normalize #RGB / #RRGGBB to lowercase #RRGGBB. */
export function normalizeHexColor(value: string): string {
    if (!isHexColor(value)) return DEFAULT_DRAW_COLOR;

    const raw = value.slice(1);
    if (raw.length === 3) {
        return `#${raw
            .split("")
            .map((ch) => `${ch}${ch}`)
            .join("")
            .toLowerCase()}`;
    }

    return `#${raw.toLowerCase()}`;
}

function clampChannel(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(255, Math.max(0, Math.round(value)));
}

function clampUnit(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
}

export function hexToRgb(hex: string): RgbColor {
    const normalized = normalizeHexColor(hex).slice(1);
    return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16),
    };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
    return `#${[r, g, b]
        .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
        .join("")}`;
}

export function clampRgb({ r, g, b }: RgbColor): RgbColor {
    return {
        r: clampChannel(r),
        g: clampChannel(g),
        b: clampChannel(b),
    };
}

export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
    const rn = clampChannel(r) / 255;
    const gn = clampChannel(g) / 255;
    const bn = clampChannel(b) / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === rn) h = ((gn - bn) / delta) % 6;
        else if (max === gn) h = (bn - rn) / delta + 2;
        else h = (rn - gn) / delta + 4;
        h *= 60;
        if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : delta / max;
    return { h, s, v: max };
}

export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
    const hue = ((h % 360) + 360) % 360;
    const sat = clampUnit(s);
    const val = clampUnit(v);
    const c = val * sat;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = val - c;

    let rn = 0;
    let gn = 0;
    let bn = 0;

    if (hue < 60) [rn, gn, bn] = [c, x, 0];
    else if (hue < 120) [rn, gn, bn] = [x, c, 0];
    else if (hue < 180) [rn, gn, bn] = [0, c, x];
    else if (hue < 240) [rn, gn, bn] = [0, x, c];
    else if (hue < 300) [rn, gn, bn] = [x, 0, c];
    else [rn, gn, bn] = [c, 0, x];

    return {
        r: Math.round((rn + m) * 255),
        g: Math.round((gn + m) * 255),
        b: Math.round((bn + m) * 255),
    };
}

export function hsvToHex(hsv: HsvColor): string {
    return rgbToHex(hsvToRgb(hsv));
}
