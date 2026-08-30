"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
  motion,
} from "motion/react";
import * as THREE from "three";

const STAGE_COUNT = 5;

const CAPTIONS = [
  {
    title: "One drop at a time.",
    body: "Used cooking oil, collected from kitchens across the city.",
  },
  {
    title: "On its way.",
    body: "Every pickup is tracked from kitchen to processing.",
  },
  {
    title: "Closing the loop.",
    body: "Waste oil enters a responsible, circular process.",
  },
  {
    title: "Becoming energy.",
    body: "Processing transforms it into renewable fuel.",
  },
  {
    title: "New energy, new possibility.",
    body: "Clean power, from what would have been waste.",
  },
];

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  varying vec3 vColor;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  float stageDroplet(vec3 d) {
    float t = d.y;
    float bump = pow(max(t, 0.0), 1.7) * 0.55;
    float pinch = pow(max(t, 0.0), 4.0) * 0.16;
    return 1.0 + bump - pinch;
  }

  float stageStretch(vec3 d) {
    float t = d.y;
    float bump = pow(max(t, 0.0), 1.3) * 0.95;
    float neck = smoothstep(0.15, 0.9, t) * 0.28;
    return 1.0 + bump - neck;
  }

  float stageRing(vec3 d) {
    float eq = 1.0 - abs(d.y);
    float flat = pow(eq, 0.6) * 0.55;
    float theta = atan(d.z, d.x);
    float flute = sin(theta * 10.0) * 0.03 * eq;
    return 0.55 + flat + flute;
  }

  float stageEnergy(vec3 d, float t) {
    float n = sin(d.x * 6.0 + t * 2.0) * sin(d.y * 6.0 + t * 1.7) * sin(d.z * 6.0 + t * 2.3);
    return 1.05 + n * 0.16;
  }

  float stageLeaf(vec3 d) {
    vec3 axis = normalize(vec3(0.6, 0.8, 0.0));
    float t = dot(d, axis);
    float bump = pow(max(t, 0.0), 1.4) * 0.7;
    float rib = sin(d.x * 5.0) * 0.02 * max(t, 0.0);
    float flat = 1.0 - abs(d.z) * 0.15;
    return (1.0 + bump + rib) * flat;
  }

  float getRadius(int stage, vec3 d, float time) {
    if (stage == 0) return stageDroplet(d);
    if (stage == 1) return stageStretch(d);
    if (stage == 2) return stageRing(d);
    if (stage == 3) return stageEnergy(d, time);
    return stageLeaf(d);
  }

  vec3 getColor(int stage) {
    if (stage == 0) return vec3(0.55, 0.62, 0.72);
    if (stage == 1) return vec3(0.35, 0.55, 0.85);
    if (stage == 2) return vec3(0.85, 0.65, 0.25);
    if (stage == 3) return vec3(0.95, 0.82, 0.4);
    return vec3(0.25, 0.55, 0.35);
  }

  void main() {
    vec3 dir = normalize(position);
    float p = clamp(uProgress, 0.0, float(${STAGE_COUNT - 1}));
    int stageA = int(floor(p + 0.0001));
    int stageB = min(stageA + 1, ${STAGE_COUNT - 1});
    float f = fract(p);

    float rA = getRadius(stageA, dir, uTime);
    float rB = getRadius(stageB, dir, uTime);
    float r = mix(rA, rB, f);

    vColor = mix(getColor(stageA), getColor(stageB), f);

    vec3 newPos = dir * r;
    vec4 worldPos = modelMatrix * vec4(newPos, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * dir);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.5);
    float diffuse = max(dot(vNormalW, normalize(vec3(0.4, 0.8, 0.6))), 0.18);
    vec3 color = vColor * diffuse + vec3(1.0) * fresnel * 0.55;
    gl_FragColor = vec4(color, 0.94);
  }
`;

const burstVertexShader = /* glsl */ `
  uniform float uBurst;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 dir = normalize(position);
    float travel = uBurst * (0.6 + aSeed * 1.8);
    vec3 pos = dir * (1.4 + travel);
    vAlpha = clamp(uBurst * 2.0, 0.0, 1.0) * (1.0 - clamp(uBurst, 0.0, 1.0));
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (2.5 + aSeed * 3.5) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const burstFragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    vec3 color = mix(vec3(0.85, 0.65, 0.25), vec3(0.35, 0.7, 0.45), 0.5);
    gl_FragColor = vec4(color, vAlpha * (1.0 - d * 2.0));
  }
`;

function BurstParticles({ progressRef, detail }: { progressRef: React.RefObject<number>; detail: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = detail > 3 ? 800 : 300;

  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().randomDirection();
      pos.set([v.x, v.y, v.z], i * 3);
      seed[i] = Math.random();
    }
    return [pos, seed];
  }, [count]);

  const uniforms = useMemo(() => ({ uBurst: { value: 0 } }), []);

  useFrame(() => {
    if (!materialRef.current) return;
    const p = progressRef.current ?? 0;
    const burst = Math.max(0, (p - (STAGE_COUNT - 1) * 0.78) / ((STAGE_COUNT - 1) * 0.22));
    materialRef.current.uniforms.uBurst.value = burst;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={burstVertexShader}
        fragmentShader={burstFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MorphMesh({ progressRef, detail }: { progressRef: React.RefObject<number>; detail: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, detail), [detail]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!materialRef.current || !meshRef.current) return;
    const p = progressRef.current ?? 0;
    materialRef.current.uniforms.uProgress.value = p;
    materialRef.current.uniforms.uTime.value += delta;
    meshRef.current.rotation.y += delta * 0.18;

    const burst = Math.max(0, (p - (STAGE_COUNT - 1) * 0.78) / ((STAGE_COUNT - 1) * 0.22));
    const scale = 1 - burst * 0.55;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

function MorphScene({ progressRef, detail }: { progressRef: React.RefObject<number>; detail: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
    >
      <MorphMesh progressRef={progressRef} detail={detail} />
      <BurstParticles progressRef={progressRef} detail={detail} />
    </Canvas>
  );
}

function StaticFallback() {
  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="mx-auto h-64 w-64 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(219,234,254,0.9),rgba(59,130,246,0.7)_60%,rgba(29,78,216,0.8)_100%)] blur-[1px]"
      />
      <div className="mx-auto mt-16 max-w-2xl space-y-14 px-6">
        {CAPTIONS.map((c) => (
          <div key={c.title} className="text-center">
            <h3 className="text-2xl font-bold tracking-tight text-nav-dark-text">{c.title}</h3>
            <p className="mt-2 text-nav-muted">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ScrollMorphHero() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);
  const [detail, setDetail] = useState(4);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setDetail(mq.matches ? 3 : 4);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const morphProgress = useTransform(scrollYProgress, [0, 1], [0, STAGE_COUNT - 1]);

  useMotionValueEvent(morphProgress, "change", (v) => {
    progressRef.current = v;
    const stage = Math.min(STAGE_COUNT - 1, Math.max(0, Math.round(v)));
    setActiveStage((prev) => (prev === stage ? prev : stage));
  });

  if (prefersReducedMotion) {
    return <StaticFallback />;
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${STAGE_COUNT * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_50%,var(--color-secondary)_0%,var(--color-background)_70%)]"
        />
        <div className="absolute inset-0">
          <MorphScene progressRef={progressRef} detail={detail} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-6 sm:bottom-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-md text-center"
            >
              <h3 className="text-2xl font-bold tracking-tight text-nav-dark-text sm:text-3xl">
                {CAPTIONS[activeStage].title}
              </h3>
              <p className="mt-2 text-nav-muted">{CAPTIONS[activeStage].body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-1.5">
          {CAPTIONS.map((c, i) => (
            <span
              key={c.title}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeStage ? "w-6 bg-nav-primary" : "w-1.5 bg-nav-muted/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
