"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useDrawMode } from "./draw-mode";
import type { DrawTool } from "./draw-utils";

type Point = { x: number; y: number };

type Stroke = {
  tool: DrawTool;
  color: string;
  width: number;
  points: Point[];
};

/** Viewport point → document (scroll-stable) coordinates. */
function toDocumentPoint(e: PointerEvent): Point {
  return {
    x: e.clientX + window.scrollX,
    y: e.clientY + window.scrollY,
  };
}

function paintStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[]) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();

  const ox = window.scrollX;
  const oy = window.scrollY;

  for (const stroke of strokes) {
    if (stroke.points.length === 0) continue;

    const erasing = stroke.tool === "eraser";
    ctx.save();
    ctx.globalCompositeOperation = erasing
      ? "destination-out"
      : "source-over";
    ctx.strokeStyle = erasing ? "rgba(0,0,0,1)" : stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    const first = stroke.points[0];
    ctx.moveTo(first.x - ox, first.y - oy);

    if (stroke.points.length === 1) {
      ctx.lineTo(first.x - ox, first.y - oy);
    } else {
      for (let i = 1; i < stroke.points.length; i++) {
        const p = stroke.points[i];
        ctx.lineTo(p.x - ox, p.y - oy);
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}

export function DrawCanvas() {
  const { active, tool, color, strokeWidth, clearVersion } = useDrawMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const drawingRef = useRef(false);
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const widthRef = useRef(strokeWidth);

  toolRef.current = tool;
  colorRef.current = color;
  widthRef.current = strokeWidth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const nextW = Math.floor(w * dpr);
      const nextH = Math.floor(h * dpr);
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintStrokes(ctx, strokesRef.current);
    };

    redraw();
    window.addEventListener("resize", redraw);
    window.addEventListener("scroll", redraw, { passive: true });
    return () => {
      window.removeEventListener("resize", redraw);
      window.removeEventListener("scroll", redraw);
    };
  }, []);

  useEffect(() => {
    if (clearVersion === 0) return;
    strokesRef.current = [];
    currentStrokeRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, [clearVersion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const redraw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintStrokes(ctx, strokesRef.current);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drawingRef.current = true;
      const point = toDocumentPoint(e);
      const stroke: Stroke = {
        tool: toolRef.current,
        color: colorRef.current,
        width: widthRef.current,
        points: [point],
      };
      currentStrokeRef.current = stroke;
      strokesRef.current = [...strokesRef.current, stroke];
      canvas.setPointerCapture(e.pointerId);
      redraw();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current || !currentStrokeRef.current) return;
      currentStrokeRef.current.points.push(toDocumentPoint(e));
      redraw();
    };

    const endStroke = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      currentStrokeRef.current = null;
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    };

    const onWheel = (e: WheelEvent) => {
      window.scrollBy({ left: e.deltaX, top: e.deltaY });
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endStroke);
      canvas.removeEventListener("pointercancel", endStroke);
      canvas.removeEventListener("wheel", onWheel);
      drawingRef.current = false;
      currentStrokeRef.current = null;
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "fixed inset-0 z-40 touch-none",
        active
          ? tool === "eraser"
            ? "pointer-events-auto cursor-cell"
            : "pointer-events-auto cursor-crosshair"
          : "pointer-events-none",
      )}
    />
  );
}
