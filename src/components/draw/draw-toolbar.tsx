"use client";

import type { ReactNode } from "react";
import { LuEraser, LuPaintbrush, LuTrash2, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/locale";
import { cn } from "@/utils/cn";
import { DrawColorPicker } from "./draw-color-picker";
import {
  STROKE_SIZES,
  useDrawMode,
  type DrawTool,
  type StrokeSize,
} from "./draw-mode";

function ToolButton({
  label,
  onClick,
  className,
  children,
  pressed,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  pressed?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            aria-pressed={pressed}
            onClick={onClick}
            className={cn(
              "size-9 cursor-pointer rounded-sm bg-transparent hover:bg-muted",
              pressed && "bg-muted",
              className,
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export function DrawToolbar() {
  const {
    active,
    setActive,
    tool,
    setTool,
    strokeSize,
    setStrokeSize,
    clear,
  } = useDrawMode();
  const t = useTranslations();

  if (!active) return null;

  const sizeLabels: Record<StrokeSize, string> = {
    fine: t("draw.fine"),
    medium: t("draw.medium"),
    thick: t("draw.thick"),
  };

  const toolLabels: Record<DrawTool, string> = {
    pen: t("draw.pen"),
    eraser: t("draw.eraser"),
  };

  return (
    <div
      role="toolbar"
      aria-label={t("draw.toolbar")}
      className="pointer-events-auto fixed inset-x-0 bottom-5 z-50 mx-auto flex w-max max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-md border border-border bg-popover px-2 py-1.5 text-popover-foreground shadow-lg"
    >
      <div
        className="flex items-center gap-0.5"
        role="group"
        aria-label={t("draw.toolGroup")}
      >
        <ToolButton
          label={toolLabels.pen}
          pressed={tool === "pen"}
          onClick={() => setTool("pen")}
        >
          <LuPaintbrush aria-hidden className="size-4" />
        </ToolButton>
        <ToolButton
          label={toolLabels.eraser}
          pressed={tool === "eraser"}
          onClick={() => setTool("eraser")}
        >
          <LuEraser aria-hidden className="size-4" />
        </ToolButton>
      </div>

      <div aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border" />

      <div role="group" aria-label={t("draw.colorGroup")}>
        <DrawColorPicker />
      </div>

      <div aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border" />

      <div
        className="flex items-center gap-0.5"
        role="group"
        aria-label={t("draw.strokeGroup")}
      >
        {(Object.keys(STROKE_SIZES) as StrokeSize[]).map((size) => (
          <ToolButton
            key={size}
            label={sizeLabels[size]}
            pressed={strokeSize === size}
            onClick={() => setStrokeSize(size)}
          >
            <span
              aria-hidden
              className="rounded-full bg-foreground"
              style={{
                width: STROKE_SIZES[size] + 2,
                height: STROKE_SIZES[size] + 2,
              }}
            />
          </ToolButton>
        ))}
      </div>

      <div aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border" />

      <ToolButton label={t("draw.clear")} onClick={clear}>
        <LuTrash2 aria-hidden className="size-4" />
      </ToolButton>

      <ToolButton label={t("draw.leave")} onClick={() => setActive(false)}>
        <LuX aria-hidden className="size-4" />
      </ToolButton>
    </div>
  );
}
