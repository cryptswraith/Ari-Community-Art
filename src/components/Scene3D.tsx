// src/components/Scene3D.tsx
import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Scene3DProps {
  scrollIndex: number;
  hasEntered: boolean;
}

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

// --- Abstract Model ---
function AbstractModel({ opacity }: { opacity: number }) {
  const { scene } = useGLTF("/models/Abstract_Symmetry_1028095503_generate.glb");
  const ref = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scale.set(IS_MOBILE ? 1.3 : 2, IS_MOBILE ? 1.3 : 2, IS_MOBILE ? 1.3 : 2);
    ref.current.position.set(0, 0, 0);
    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.color = new THREE.Color("#2b0000");
          mat.emissive = new THREE.Color("#1a0000");
          mat.emissiveIntensity = 0.5;
          mat.metalness = 0.5;
          mat.roughness = 0.4;
          mat.transparent = true;
        }
      }
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.04;

    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;
        mat.opacity = opacity;

        const base = new THREE.Color("#2b0000");
        const rim = new THREE.Color("#ff3b3b");
        const rimMix = (Math.sin(t * 0.7) * 0.5 + 0.5) * 0.3;
        mat.color = base.clone().lerp(rim, rimMix);
        mat.emissive = rim.clone().multiplyScalar(0.3);
        mat.emissiveIntensity = 0.5 * opacity;
      }
    });
  });

  return <primitive ref={ref} object={scene} />;
}

// --- Mist Particles ---
function MistParticles({ opacity }: { opacity: number }) {
  const COUNT = IS_MOBILE ? 150 : 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 3.0 + Math.random() * 1.5;
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  const texture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,60,60,1)");
    gradient.addColorStop(0.3, "rgba(255,40,40,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.03;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = opacity * (0.2 + 0.05 * Math.sin(t * 0.8));
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={IS_MOBILE ? 0.15 : 0.25}
        transparent
        map={texture}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// --- Crimson Drift Field ---
function CrimsonDriftField({ opacity }: { opacity: number }) {
  const COUNT = IS_MOBILE ? 300 : 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 12 + Math.random() * 8;
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.01;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = (IS_MOBILE ? 0.06 : 0.1) * opacity + Math.sin(t * 0.3) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={IS_MOBILE ? 0.25 : 0.35}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color="#ff5050"
      />
    </points>
  );
}

// --- Red Pulse Light & Cinematic Spotlight ---
function RedPulseLight({ opacity, scrollIndex }: { opacity: number; scrollIndex: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.elapsedTime;
    const base = 0.9 + Math.sin(t * 0.6) * 0.35;
    const scrollBoost = 1 + scrollIndex * 0.3;
    lightRef.current.intensity = base * opacity * 1.2 * scrollBoost;
  });
  return <pointLight ref={lightRef} distance={12} decay={2} color={"#ff2a4a"} />;
}

function CinematicSpotlight({ opacity }: { opacity: number }) {
  const ref = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !rimRef.current) return;
    const t = clock.elapsedTime;
    const radius = IS_MOBILE ? 3 : 5;

    ref.current.position.set(
      Math.cos(t * 0.3) * radius,
      Math.sin(t * 0.25) * 2 + 1,
      Math.sin(t * 0.3) * radius + 4
    );
    targetRef.current.position.set(Math.sin(t * 0.4) * 0.6, Math.cos(t * 0.5) * 0.5, 0);

    ref.current.intensity = THREE.MathUtils.lerp(
      ref.current.intensity,
      (IS_MOBILE ? 0.6 : 0.8) * opacity,
      0.05
    );

    rimRef.current.position.set(Math.sin(t * 0.4) * -3, Math.cos(t * 0.6) * 2, -3);
  });

  return (
    <>
      <spotLight
        ref={ref}
        color="#ff4a4a"
        angle={Math.PI / 9}
        penumbra={0.9}
        distance={30}
        decay={2}
      />
      <pointLight ref={rimRef} color="#ff1e1e" distance={10} decay={2} intensity={0.3} />
      <primitive object={targetRef.current} />
    </>
  );
}

// --- Scene Content ---
function SceneContent({ scrollIndex, hasEntered }: Scene3DProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { mouse, viewport, scene } = useThree();
  const [intro, setIntro] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    scene.fog = new THREE.Fog("#080001", 6, 30);
    (scene as any).background = new THREE.Color("#000000");
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    if (intro) {
      const next = Math.min(1, introProgress + delta * 0.25);
      setIntroProgress(next);
      setOpacity(Math.pow(next, 1.6));
      if (cameraRef.current) {
        cameraRef.current.position.z = THREE.MathUtils.lerp(IS_MOBILE ? 20 : 25, 10, next);
      }
      if (next >= 1) setIntro(false);
      return;
    }

    const targetOpacity = hasEntered ? 0.7 + scrollIndex * 0.2 : 0.25;
    setOpacity((prev) => THREE.MathUtils.lerp(prev, targetOpacity, 0.05));

    if (cameraRef.current) {
      const mouseX = (mouse.x * viewport.width) / (IS_MOBILE ? 10 : 8);
      const mouseY = (mouse.y * viewport.height) / (IS_MOBILE ? 10 : 8);
      cameraRef.current.position.x += (mouseX - cameraRef.current.position.x) * 0.08;
      cameraRef.current.position.y += (mouseY - cameraRef.current.position.y) * 0.08;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={IS_MOBILE ? 65 : 60} position={[0, 0, 25]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.2 * opacity} color="#2b0000" />
      <RedPulseLight opacity={opacity} scrollIndex={scrollIndex} />
      <CinematicSpotlight opacity={opacity} />
      <CrimsonDriftField opacity={opacity} />
      <MistParticles opacity={opacity} />
      <AbstractModel opacity={opacity} />
    </>
  );
}

export default function Scene3D({ scrollIndex, hasEntered }: Scene3DProps) {
  return (
    <div
      className="w-full h-full fixed inset-0 -z-10 pointer-events-none"
      style={{ touchAction: "none" }}
    >
      <Canvas
        gl={{
          antialias: false,
          powerPreference: "low-power",
          alpha: true,
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 60 }}
      >
        <SceneContent scrollIndex={scrollIndex} hasEntered={hasEntered} />
      </Canvas>
    </div>
  );
}


useGLTF.preload("/models/Abstract_Symmetry_1028095503_generate.glb");
