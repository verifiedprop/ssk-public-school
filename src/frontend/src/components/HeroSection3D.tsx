import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  OrbitControls,
  Stars,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { type Variants, motion } from "motion/react";
import { Suspense, useRef } from "react";
import type * as THREE from "three";

// ─── 3D Scene Shapes ────────────────────────────────────────────────────────

function IcoShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.elapsedTime * 0.18;
    meshRef.current.rotation.y = clock.elapsedTime * 0.12;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[3.2, 0.8, -2]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <MeshDistortMaterial
          color="#C9A227"
          distort={0.35}
          speed={1.5}
          transparent
          opacity={0.55}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[3.2, 0.8, -2]}>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial
          color="#FFD700"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </Float>
  );
}

function OctoShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = clock.elapsedTime * 0.14;
    meshRef.current.rotation.x = clock.elapsedTime * 0.09;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={meshRef} position={[-3.5, -0.6, -3]}>
        <octahedronGeometry args={[1.0, 0]} />
        <MeshWobbleMaterial
          color="#4477CC"
          factor={0.3}
          speed={1.2}
          transparent
          opacity={0.5}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[-3.5, -0.6, -3]}>
        <octahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial
          color="#6699FF"
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>
    </Float>
  );
}

function TorusShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.elapsedTime * 0.22;
    meshRef.current.rotation.y = clock.elapsedTime * 0.16;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.7} floatIntensity={0.9}>
      <mesh ref={meshRef} position={[0.5, 2.4, -4]}>
        <torusGeometry args={[0.85, 0.32, 16, 60]} />
        <MeshDistortMaterial
          color="#C9A227"
          distort={0.25}
          speed={2.0}
          transparent
          opacity={0.45}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </Float>
  );
}

function DodecaShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.1;
    meshRef.current.rotation.z = clock.elapsedTime * 0.08;
  });
  return (
    <Float speed={0.9} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[-1.8, -2.2, -2.5]}>
        <dodecahedronGeometry args={[0.95, 0]} />
        <MeshWobbleMaterial
          color="#3355BB"
          factor={0.2}
          speed={0.9}
          transparent
          opacity={0.48}
          metalness={0.75}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-1.8, -2.2, -2.5]}>
        <dodecahedronGeometry args={[1.0, 0]} />
        <meshBasicMaterial
          color="#88AAFF"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </Float>
  );
}

function SmallGoldSphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = 0.05 + Math.random() * 0.08;
  const offset = Math.random() * Math.PI * 2;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * speed + offset) * 0.6;
    ref.current.position.x =
      position[0] + Math.cos(clock.elapsedTime * speed * 0.7 + offset) * 0.4;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#C9A227"
        emissiveIntensity={1.2}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

const PARTICLE_POSITIONS: [number, number, number][] = [
  [-4.2, 1.5, -5],
  [4.8, -1.2, -6],
  [-2.1, 3.1, -3.5],
  [2.9, -2.8, -4],
  [-3.8, -1.8, -5.5],
  [1.5, 3.5, -5],
  [3.6, 2.1, -3],
  [-0.8, -3.2, -4.5],
  [-5.1, 0.5, -6],
  [5.2, 1.8, -5],
  [0.3, -1.5, -2.5],
  [-2.5, 0.8, -6],
  [4.1, -3.2, -5.5],
  [-1.3, 2.8, -4],
  [3.3, 0.2, -6],
];

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} color="#FFD700" intensity={1.8} />
      <pointLight position={[-5, -3, 2]} color="#4477FF" intensity={1.4} />
      <pointLight position={[0, 0, 4]} color="#ffffff" intensity={0.6} />
      <Stars
        radius={80}
        depth={50}
        count={2800}
        factor={3}
        saturation={0.3}
        fade
        speed={0.4}
      />
      <IcoShape />
      <OctoShape />
      <TorusShape />
      <DodecaShape />
      {PARTICLE_POSITIONS.map((pos, _i) => (
        <SmallGoldSphere
          key={`particle-${pos[0].toFixed(2)}-${pos[1].toFixed(2)}-${pos[2].toFixed(2)}`}
          position={pos}
        />
      ))}
    </>
  );
}

// ─── Stats Row ───────────────────────────────────────────────────────────────

const heroStats = [
  { val: "1200+", label: "Students" },
  { val: "80+", label: "Teachers" },
  { val: "98%", label: "Pass Rate" },
  { val: "15+", label: "Years" },
];

// ─── Motion Variants ─────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

// ─── Main Export ─────────────────────────────────────────────────────────────

export function HeroSection3D() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", background: "oklch(0.13 0.025 270)" }}
      data-ocid="hero.section"
    >
      {/* Radial depth overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, oklch(0.22 0.08 250 / 0.55) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, oklch(0.18 0.06 240 / 0.35) 0%, transparent 60%)",
        }}
      />

      {/* ── 3D Canvas ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2]">
        <Suspense
          fallback={
            <div
              className="w-full h-full"
              style={{ background: "oklch(0.13 0.025 270)" }}
            />
          }
        >
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: "100%", height: "100%" }}
            dpr={[1, 2]}
          >
            <Scene3D />
          </Canvas>
        </Suspense>
      </div>

      {/* ── Glassmorphism Content Panel ────────────────────────────────── */}
      <div className="relative z-[10] flex items-center justify-center min-h-[100svh] px-4 py-20">
        <div className="w-full max-w-5xl">
          <div
            className="rounded-3xl p-8 md:p-12 lg:p-14"
            style={{
              background: "oklch(0.14 0.02 270 / 0.72)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid oklch(0.62 0.22 65 / 0.22)",
              boxShadow:
                "0 24px 80px oklch(0.08 0.02 270 / 0.7), inset 0 1px 0 oklch(0.62 0.22 65 / 0.15)",
            }}
          >
            {/* Admission badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest"
                style={{
                  background: "oklch(0.62 0.22 65 / 0.18)",
                  border: "1px solid oklch(0.62 0.22 65 / 0.55)",
                  color: "oklch(0.82 0.18 65)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "oklch(0.72 0.22 65)" }}
                />
                Admissions Open 2026–27
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display font-bold leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)" }}
            >
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, oklch(0.88 0.18 65) 0%, oklch(0.98 0.04 80) 45%, oklch(0.78 0.14 65) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SSK Public School
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="font-display text-lg md:text-2xl font-medium mb-3"
              style={{ color: "oklch(0.72 0.06 240)" }}
            >
              Excellence in Education Since 2005
            </motion.p>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
              style={{ color: "oklch(0.65 0.04 270)" }}
            >
              Nurturing young minds with world-class CBSE education, modern
              infrastructure, and holistic development for a bright future.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10"
            >
              {/* Primary */}
              <a
                href="/admissions"
                className="inline-flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "oklch(0.62 0.22 65)",
                  color: "oklch(0.12 0.02 270)",
                  boxShadow: "0 4px 24px oklch(0.62 0.22 65 / 0.45)",
                }}
                data-ocid="hero.apply_button"
              >
                Apply Now
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Secondary */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "oklch(0.98 0 0 / 0.07)",
                  border: "1.5px solid oklch(0.98 0 0 / 0.35)",
                  color: "oklch(0.95 0.01 270)",
                  backdropFilter: "blur(8px)",
                }}
                data-ocid="hero.visit_button"
              >
                Book Campus Visit
              </a>

              {/* Tertiary */}
              <a
                href="/about"
                className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm transition-all duration-200 hover:opacity-100 opacity-75"
                style={{ color: "oklch(0.82 0.18 65)" }}
                data-ocid="hero.brochure_link"
              >
                Download Brochure
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 3v8M4 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-wrap gap-6 pt-6"
              style={{
                borderTop: "1px solid oklch(0.62 0.22 65 / 0.18)",
              }}
            >
              {heroStats.map(({ val, label }, i) => (
                <div key={label} className="flex items-center gap-3">
                  {i > 0 && (
                    <div
                      className="hidden sm:block w-px h-8 self-center"
                      style={{ background: "oklch(0.62 0.22 65 / 0.22)" }}
                    />
                  )}
                  <div>
                    <div
                      className="font-display font-bold text-xl md:text-2xl leading-none"
                      style={{ color: "oklch(0.82 0.2 65)" }}
                    >
                      {val}
                    </div>
                    <div
                      className="text-xs mt-0.5 font-medium tracking-wide"
                      style={{ color: "oklch(0.55 0.04 270)" }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
