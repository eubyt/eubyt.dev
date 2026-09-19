"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TOTAL_DURATION = 0.9;
const WATER_COLOR = "#6eb6e8";

type Particle = {
  angle: number;
  speed: number;
  size: number;
};

type WaterDropProps = {
  x: number;
  y: number;
  onComplete: () => void;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuad(t: number) {
  return t * (2 - t);
}

const PARTICLES: Particle[] = Array.from({ length: 6 }, (_, i) => ({
  angle: (i / 6) * Math.PI * 2 + 0.35,
  speed: 28 + (i % 3) * 10,
  size: 1.4 + (i % 2) * 0.6,
}));

export function WaterDrop({ x, y, onComplete }: WaterDropProps) {
  const ringMatsRef = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const ringMeshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const particleMatsRef = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const elapsed = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current) return;

    elapsed.current += delta;
    const t = elapsed.current;

    if (t >= TOTAL_DURATION) {
      done.current = true;
      onComplete();
      return;
    }

    ringMeshesRef.current.forEach((mesh, i) => {
      const mat = ringMatsRef.current[i];
      if (!mesh || !mat) return;

      const delay = i * 0.08;
      const local = t - delay;
      if (local <= 0) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;
      const duration = 0.75;
      const p = Math.min(1, local / duration);
      const radius = 4 + easeOutCubic(p) * (36 + i * 10);
      mesh.scale.set(radius, radius, 1);
      mat.opacity = 0.55 * (1 - easeOutQuad(p));
    });

    particleRefs.current.forEach((mesh, i) => {
      const mat = particleMatsRef.current[i];
      const particle = PARTICLES[i];
      if (!mesh || !mat || !particle) return;

      mesh.visible = true;
      const life = Math.min(1, t / 0.55);
      const dist = particle.speed * easeOutCubic(Math.min(1, t / 0.35));
      const gravity = 90 * t * t;
      mesh.position.set(
        Math.cos(particle.angle) * dist,
        Math.sin(particle.angle) * dist * 0.55 + 12 * (1 - life) - gravity * 0.15,
        0
      );
      const s = particle.size * (1 - life * 0.7);
      mesh.scale.setScalar(s);
      mat.opacity = 0.7 * (1 - life);
    });
  });

  return (
    <group position={[x, y, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={`ring-${i}`}
          ref={(el) => {
            ringMeshesRef.current[i] = el;
          }}
          visible={false}
        >
          <ringGeometry args={[0.92, 1, 64]} />
          <meshBasicMaterial
            ref={(el) => {
              ringMatsRef.current[i] = el;
            }}
            color={WATER_COLOR}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {PARTICLES.map((_, i) => (
        <mesh
          key={`particle-${i}`}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            ref={(el) => {
              particleMatsRef.current[i] = el;
            }}
            color={WATER_COLOR}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
