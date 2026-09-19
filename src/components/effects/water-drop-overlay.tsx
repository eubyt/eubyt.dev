"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { WaterDrop } from "./water-drop";

const MAX_DROPS = 10;

type DropInstance = {
  id: number;
  x: number;
  y: number;
};

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function useIsClient() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

function ViewportCamera() {
  const size = useThree((s) => s.size);

  return (
    <OrthographicCamera
      makeDefault
      position={[0, 0, 100]}
      left={-size.width / 2}
      right={size.width / 2}
      top={size.height / 2}
      bottom={-size.height / 2}
      near={0.1}
      far={1000}
    />
  );
}

function DropScene({
  drops,
  onComplete,
}: {
  drops: DropInstance[];
  onComplete: (id: number) => void;
}) {
  return (
    <>
      <ViewportCamera />
      {drops.map((drop) => (
        <WaterDrop
          key={drop.id}
          x={drop.x}
          y={drop.y}
          onComplete={() => onComplete(drop.id)}
        />
      ))}
    </>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function WaterDropOverlay() {
  const isClient = useIsClient();
  const [drops, setDrops] = useState<DropInstance[]>([]);
  const nextIdRef = useRef(0);

  const removeDrop = useCallback((id: number) => {
    setDrops((prev) => prev.filter((d) => d.id !== id));
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (prefersReducedMotion()) return;

      const x = event.clientX - window.innerWidth / 2;
      const y = -(event.clientY - window.innerHeight / 2);
      const id = nextIdRef.current++;

      setDrops((prev) => {
        const next = [...prev, { id, x, y }];
        if (next.length > MAX_DROPS) {
          return next.slice(next.length - MAX_DROPS);
        }
        return next;
      });
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-100"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
        orthographic
      >
        <DropScene drops={drops} onComplete={removeDrop} />
      </Canvas>
    </div>
  );
}
