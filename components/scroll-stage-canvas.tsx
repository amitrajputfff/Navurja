"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The 5 morph stages the droplet passes through as it travels down the page,
 * mapped 1:1 to STAGE_ANCHOR_IDS in scroll-stage.tsx: raw oil (hero) → oil
 * gold (problem) → transforming (process) → energy flash (impact) → leaf
 * green (final CTA), where it bursts apart to hand off to the static footer
 * mark. Colors are the shape functions are carried over from the original
 * scroll-morph-hero.tsx prototype; only the palette changed (blue/gray → the
 * gold/green NavUrja accent).
 */
export const STAGE_COUNT = 5;

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
    float flatten = pow(eq, 0.6) * 0.55;
    float theta = atan(d.z, d.x);
    float flute = sin(theta * 10.0) * 0.03 * eq;
    return 0.55 + flatten + flute;
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
    float flatten = 1.0 - abs(d.z) * 0.15;
    return (1.0 + bump + rib) * flatten;
  }

  float getRadius(int stage, vec3 d, float time) {
    if (stage == 0) return stageDroplet(d);
    if (stage == 1) return stageStretch(d);
    if (stage == 2) return stageRing(d);
    if (stage == 3) return stageEnergy(d, time);
    return stageLeaf(d);
  }

  vec3 getColor(int stage) {
    if (stage == 0) return vec3(0.60, 0.55, 0.42); // raw used oil
    if (stage == 1) return vec3(0.79, 0.59, 0.25); // nav-oil-gold
    if (stage == 2) return vec3(0.55, 0.66, 0.42); // transforming
    if (stage == 3) return vec3(0.88, 0.80, 0.40); // energy flash
    return vec3(0.18, 0.62, 0.36); // nav-green
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
  uniform float uOpacity;
  varying vec3 vColor;
  varying vec3 vNormalW;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.5);
    float diffuse = max(dot(vNormalW, normalize(vec3(0.4, 0.8, 0.6))), 0.18);
    vec3 color = vColor * diffuse + vec3(1.0) * fresnel * 0.5;
    gl_FragColor = vec4(color, 0.6 * uOpacity);
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
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    vec3 color = mix(vec3(0.79, 0.59, 0.25), vec3(0.18, 0.62, 0.36), 0.5);
    gl_FragColor = vec4(color, vAlpha * (1.0 - d * 2.0) * uOpacity);
  }
`;

/** Both the mesh and the burst points ramp their opacity off the same
 * envelope, and both need to know how "burst apart" the finale is — one
 * formula, shared, instead of the duplicate literal that existed twice in
 * the original prototype. */
function burstAmount(stageProgress: number) {
  return Math.max(
    0,
    (stageProgress - (STAGE_COUNT - 1) * 0.78) / ((STAGE_COUNT - 1) * 0.22)
  );
}

function BurstParticles({
  stageProgressRef,
  opacityRef,
  detail,
}: {
  stageProgressRef: React.RefObject<number>;
  opacityRef: React.RefObject<number>;
  detail: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = detail > 3 ? 500 : 220;

  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().randomDirection();
      pos.set([v.x, v.y, v.z], i * 3);
      // eslint-disable-next-line react-hooks/purity -- one-time particle seed generation at mount, not a render-time value
      seed[i] = Math.random();
    }
    return [pos, seed];
  }, [count]);

  const uniforms = useMemo(
    () => ({ uBurst: { value: 0 }, uOpacity: { value: 0 } }),
    []
  );

  useFrame(() => {
    if (!materialRef.current) return;
    const p = stageProgressRef.current ?? 0;
    materialRef.current.uniforms.uBurst.value = burstAmount(p);
    materialRef.current.uniforms.uOpacity.value = opacityRef.current ?? 0;
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

function MorphMesh({
  stageProgressRef,
  opacityRef,
  detail,
}: {
  stageProgressRef: React.RefObject<number>;
  opacityRef: React.RefObject<number>;
  detail: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.35, detail),
    [detail]
  );

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current || !meshRef.current) return;
    const p = stageProgressRef.current ?? 0;
    materialRef.current.uniforms.uProgress.value = p;
    materialRef.current.uniforms.uTime.value += delta;
    materialRef.current.uniforms.uOpacity.value = opacityRef.current ?? 0;
    meshRef.current.rotation.y += delta * 0.16;

    const burst = burstAmount(p);
    meshRef.current.scale.setScalar(1 - burst * 0.55);
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

/** Owns the droplet's journey down the page: vertical position and overall
 * scale are driven by `totalProgressRef` (0 → 1 across the whole document),
 * independent of `stageProgressRef` (0 → 4, which only drives the shape/color
 * morph). Nesting the mesh and burst inside this group means they travel
 * together without duplicating the position math in each. */
function DropletGroup({
  stageProgressRef,
  totalProgressRef,
  detail,
}: {
  stageProgressRef: React.RefObject<number>;
  totalProgressRef: React.RefObject<number>;
  detail: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);

  useFrame(() => {
    const t = totalProgressRef.current ?? 0;
    const fadeIn = Math.min(t / 0.05, 1);
    const fadeOut = 1 - Math.min(Math.max((t - 0.94) / 0.06, 0), 1);
    opacityRef.current = Math.max(0, Math.min(1, fadeIn * fadeOut));

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(1.05, -1.1, t);
      groupRef.current.scale.setScalar(Math.max(0.35, 1 - t * 0.3));
    }
  });

  return (
    <group ref={groupRef} position={[0.85, 1.05, 0]}>
      <MorphMesh
        stageProgressRef={stageProgressRef}
        opacityRef={opacityRef}
        detail={detail}
      />
      <BurstParticles
        stageProgressRef={stageProgressRef}
        opacityRef={opacityRef}
        detail={detail}
      />
    </group>
  );
}

export function StageCanvas({
  stageProgressRef,
  totalProgressRef,
  detail = 4,
}: {
  stageProgressRef: React.RefObject<number>;
  totalProgressRef: React.RefObject<number>;
  detail?: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
    >
      <DropletGroup
        stageProgressRef={stageProgressRef}
        totalProgressRef={totalProgressRef}
        detail={detail}
      />
    </Canvas>
  );
}
