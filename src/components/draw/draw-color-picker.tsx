"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { LuChevronsUpDown, LuPipette } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/locale";
import { useDrawMode } from "./draw-mode";
import {
  clampRgb,
  hexToRgb,
  hsvToHex,
  hsvToRgb,
  normalizeHexColor,
  rgbToHex,
  rgbToHsv,
  type HsvColor,
  type RgbColor,
} from "./draw-utils";

type InputMode = "rgb" | "hex";

const HUE_GRADIENT =
  "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";

function SaturationValueField({
  hsv,
  color,
  onChange,
}: {
  hsv: HsvColor;
  color: string;
  onChange: (next: Pick<HsvColor, "s" | "v">) => void;
}) {
  const areaRef = useRef<HTMLDivElement>(null);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const v = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height));
      onChange({ s, v });
    },
    [onChange],
  );

  const t = useTranslations();

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX, event.clientY);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updateFromPointer(event.clientX, event.clientY);
  };

  return (
    <div
      ref={areaRef}
      role="slider"
      aria-label={t("draw.saturationBrightness")}
      aria-valuetext={`Saturação ${Math.round(hsv.s * 100)}%, brilho ${Math.round(hsv.v * 100)}%`}
      tabIndex={0}
      className="relative aspect-[1.15] w-full cursor-crosshair touch-none overflow-hidden rounded-t-md outline-none focus-visible:ring-1 focus-visible:ring-ring"
      style={{
        backgroundImage: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))
        `,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{
          left: `${hsv.s * 100}%`,
          top: `${(1 - hsv.v) * 100}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

function HueSlider({
  hue,
  onChange,
}: {
  hue: number;
  onChange: (hue: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      onChange(ratio * 360);
    },
    [onChange],
  );

  const t = useTranslations();

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={t("draw.hue")}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      tabIndex={0}
      className="relative h-3 min-w-0 flex-1 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring"
      style={{ backgroundImage: HUE_GRADIENT }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        updateFromPointer(event.clientX);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") onChange(Math.max(0, hue - 2));
        if (event.key === "ArrowRight") onChange(Math.min(360, hue + 2));
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue} 100% 50%)`,
        }}
      />
    </div>
  );
}

function ChannelField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={255}
        value={value}
        aria-label={label}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
        className="h-8 rounded-sm px-1.5 text-center tabular-nums"
      />
      <span className="text-[0.65rem] text-muted-foreground">{label}</span>
    </label>
  );
}

export function DrawColorPicker() {
  const { color, setColor } = useDrawMode();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<InputMode>("rgb");
  const [hsv, setHsv] = useState<HsvColor>(() => rgbToHsv(hexToRgb(color)));
  const [hexDraft, setHexDraft] = useState(color);
  const canEyeDrop =
    typeof window !== "undefined" && "EyeDropper" in window;

  const syncFromHex = useCallback((hex: string) => {
    const nextHsv = rgbToHsv(hexToRgb(hex));
    setHsv((prev) => ({
      h: nextHsv.s === 0 ? prev.h : nextHsv.h,
      s: nextHsv.s,
      v: nextHsv.v,
    }));
    setHexDraft(hex);
  }, []);

  useEffect(() => {
    if (!open) return;
    syncFromHex(color);
  }, [color, open, syncFromHex]);

  const applyHsv = (next: HsvColor) => {
    const clamped = {
      h: ((next.h % 360) + 360) % 360,
      s: Math.min(1, Math.max(0, next.s)),
      v: Math.min(1, Math.max(0, next.v)),
    };
    setHsv(clamped);
    const hex = hsvToHex(clamped);
    setHexDraft(hex);
    setColor(hex);
  };

  const applyRgb = (next: RgbColor) => {
    const clamped = clampRgb(next);
    const hex = rgbToHex(clamped);
    setColor(hex);
    syncFromHex(hex);
  };

  const commitHex = () => {
    const normalized = normalizeHexColor(
      hexDraft.startsWith("#") ? hexDraft : `#${hexDraft}`,
    );
    setColor(normalized);
    syncFromHex(normalized);
  };

  const pickFromScreen = async () => {
    if (!("EyeDropper" in window)) return;
    try {
      // EyeDropper is still typed loosely across browsers.
      const EyeDropperCtor = (
        window as Window & {
          EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
        }
      ).EyeDropper;
      const result = await new EyeDropperCtor().open();
      const hex = normalizeHexColor(result.sRGBHex);
      setColor(hex);
      syncFromHex(hex);
    } catch {
      // User cancelled the eyedropper.
    }
  };

  const rgb = hsvToRgb(hsv);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip disabled={open}>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("draw.colorGroup")}
                  className="size-9 cursor-pointer rounded-sm bg-transparent hover:bg-muted"
                />
              }
            />
          }
        >
          <span
            aria-hidden
            className="size-4 rounded-sm border border-border"
            style={{ backgroundColor: color }}
          />
        </TooltipTrigger>
        <TooltipContent side="top">{t("draw.colorGroup")}</TooltipContent>
      </Tooltip>

      <PopoverContent
        side="top"
        sideOffset={10}
        align="start"
        className="w-[240px] gap-0 overflow-hidden rounded-md p-0"
      >
        <SaturationValueField
          hsv={hsv}
          color={color}
          onChange={({ s, v }) => applyHsv({ ...hsv, s, v })}
        />

        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("draw.eyedropper")}
                    disabled={!canEyeDrop}
                    onClick={pickFromScreen}
                    className="size-8 shrink-0 rounded-sm"
                  />
                }
              >
                <LuPipette aria-hidden className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="top">
                {canEyeDrop
                  ? t("draw.eyedropper")
                  : t("draw.eyedropperUnavailable")}
              </TooltipContent>
            </Tooltip>

            <span
              aria-hidden
              className="size-8 shrink-0 rounded-full border border-border shadow-inner"
              style={{ backgroundColor: color }}
            />

            <HueSlider
              hue={hsv.h}
              onChange={(h) => applyHsv({ ...hsv, h })}
            />
          </div>

          {mode === "rgb" ? (
            <div className="flex items-end gap-1.5">
              <ChannelField
                label="R"
                value={rgb.r}
                onChange={(r) => applyRgb({ ...rgb, r })}
              />
              <ChannelField
                label="G"
                value={rgb.g}
                onChange={(g) => applyRgb({ ...rgb, g })}
              />
              <ChannelField
                label="B"
                value={rgb.b}
                onChange={(b) => applyRgb({ ...rgb, b })}
              />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("draw.switchToHex")}
                      onClick={() => setMode("hex")}
                      className="mb-5 size-6 shrink-0 rounded-sm"
                    />
                  }
                >
                  <LuChevronsUpDown aria-hidden className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top">Hex</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-end gap-1.5">
              <label className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <Input
                  value={hexDraft}
                  spellCheck={false}
                  aria-label={t("draw.hexadecimal")}
                  onChange={(event) => setHexDraft(event.target.value)}
                  onBlur={commitHex}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  className="h-8 rounded-sm px-1.5 text-center font-mono uppercase"
                />
                <span className="text-[0.65rem] text-muted-foreground">HEX</span>
              </label>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("draw.switchToRgb")}
                      onClick={() => setMode("rgb")}
                      className="mb-5 size-6 shrink-0 rounded-sm"
                    />
                  }
                >
                  <LuChevronsUpDown aria-hidden className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top">RGB</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
