import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, Float32BufferAttribute, Group, MathUtils } from "three";
import { useRef } from "react";
import { useAppState } from "@/app/AppState";

type StarLayerProps = {
  depth: number;
  count: number;
  size: number;
  tint: string;
  drift: number;
};

function buildStarPositions(count: number, radius: number, depth: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const spread = radius + Math.random() * radius * 0.35;
    const angle = Math.random() * Math.PI * 2;
    const vertical = (Math.random() - 0.5) * radius * 1.35;

    values[index * 3] = Math.cos(angle) * spread;
    values[index * 3 + 1] = vertical;
    values[index * 3 + 2] = depth + (Math.random() - 0.5) * radius * 0.9;
  }

  return values;
}

function StarLayer({ depth, count, size, tint, drift }: StarLayerProps) {
  const pointsRef = useRef<Group | null>(null);
  const geometryRef = useRef<Float32BufferAttribute | null>(null);
  const { pointerRef, performanceTier } = useAppState();

  if (!geometryRef.current) {
    geometryRef.current = new Float32BufferAttribute(buildStarPositions(count, 16, depth), 3);
  }

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) {
      return;
    }

    const pointer = pointerRef.current;
    const pointerX = pointer.active ? pointer.x : window.innerWidth * 0.5;
    const pointerY = pointer.active ? pointer.y : window.innerHeight * 0.5;
    const pointerSpeed = pointer.active ? pointer.speed : 0;
    const velocityX = pointer.active ? pointer.velocityX : 0;
    const velocityY = pointer.active ? pointer.velocityY : 0;
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const scrollProgress = window.scrollY / scrollHeight;
    const speedFactor = MathUtils.clamp(pointerSpeed / 1400, 0, 1.15);
    const velocityFactorX = MathUtils.clamp(velocityX / 1600, -1, 1);
    const velocityFactorY = MathUtils.clamp(velocityY / 1600, -1, 1);
    const targetX =
      MathUtils.mapLinear(pointerY, 0, window.innerHeight, 0.12, -0.12) +
      velocityFactorY * 0.05;
    const targetY =
      MathUtils.mapLinear(pointerX, 0, window.innerWidth, -0.18, 0.18) +
      velocityFactorX * 0.06;
    const driftX = MathUtils.mapLinear(pointerX, 0, window.innerWidth, -0.35, 0.35);
    const driftY = MathUtils.mapLinear(pointerY, 0, window.innerHeight, 0.24, -0.24);
    const scrollOffset = MathUtils.lerp(-0.8, 0.8, scrollProgress);
    const depthWeight = Math.min(1.4, Math.max(0.35, Math.abs(depth) / 7));
    const swirl =
      Math.sin(state.clock.elapsedTime * (0.16 + drift * 0.08) + depth) * 0.03;
    points.rotation.x = MathUtils.lerp(
      points.rotation.x,
      targetX + swirl * 0.45,
      delta * (0.8 + speedFactor * 0.55),
    );
    points.rotation.y = MathUtils.lerp(
      points.rotation.y,
      targetY - swirl * 0.65,
      delta * (0.82 + speedFactor * 0.6),
    );
    points.rotation.z = MathUtils.lerp(
      points.rotation.z,
      scrollOffset * 0.08 + velocityFactorX * drift * 0.06 + swirl,
      delta * 0.42,
    );
    points.position.x = MathUtils.lerp(
      points.position.x,
      driftX *
        depthWeight *
        (performanceTier === "low" ? 0.16 : 0.28 + speedFactor * 0.08),
      delta * (1.2 + speedFactor * 0.4),
    );
    points.position.y = MathUtils.lerp(
      points.position.y,
      Math.sin(state.clock.elapsedTime * 0.08 + depth) *
        (performanceTier === "low" ? 0.08 : 0.16 + speedFactor * 0.05) +
        driftY * depthWeight * (0.12 + speedFactor * 0.03),
      delta * (1.4 + speedFactor * 0.35),
    );
    points.position.z = MathUtils.lerp(
      points.position.z,
      scrollOffset * drift * depthWeight * 1.6 + speedFactor * drift * 0.4,
      delta * (1 + speedFactor * 0.2),
    );
    const scale = 1 + speedFactor * (performanceTier === "low" ? 0.03 : 0.06);
    points.scale.setScalar(MathUtils.lerp(points.scale.x, scale, delta * 0.9));
  });

  return (
    <group ref={pointsRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geometryRef.current.array, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={tint}
          size={size}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

function GravityCore() {
  const groupRef = useRef<Group | null>(null);
  const { activeSection, performanceTier, reducedMotion, pointerRef } =
    useAppState();

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const heroWeight = activeSection === "hero" ? 1 : 0.25;
    const targetScale = performanceTier === "low" ? 0.8 : 1.0;
    const pointer = pointerRef.current;
    const pointerX = pointer.active ? pointer.x : window.innerWidth * 0.5;
    const pointerY = pointer.active ? pointer.y : window.innerHeight * 0.5;
    const pointerSpeed = pointer.active ? pointer.speed : 0;
    const speedFactor = MathUtils.clamp(pointerSpeed / 1600, 0, 1);
    const swayX = MathUtils.mapLinear(pointerY, 0, window.innerHeight, 0.18, -0.18);
    const swayY = MathUtils.mapLinear(pointerX, 0, window.innerWidth, -0.24, 0.24);
    const driftX = MathUtils.mapLinear(pointerX, 0, window.innerWidth, -0.45, 0.45);

    group.scale.setScalar(
      MathUtils.lerp(
        group.scale.x,
        heroWeight * (targetScale + speedFactor * 0.06),
        delta * 2.5,
      ),
    );
    group.rotation.x = MathUtils.lerp(group.rotation.x, swayX, delta * 1.8);
    group.rotation.y += delta * (reducedMotion ? 0.08 : 0.22 + speedFactor * 0.08);
    group.rotation.z = MathUtils.lerp(
      group.rotation.z,
      swayY * 0.25 +
        Math.sin(state.clock.elapsedTime * (0.42 + speedFactor * 0.1)) * 0.08,
      delta * 1.6,
    );
    group.position.x = MathUtils.lerp(
      group.position.x,
      driftX * (0.34 + speedFactor * 0.08),
      delta,
    );
    group.position.y =
      Math.sin(state.clock.elapsedTime * (0.75 + speedFactor * 0.08)) *
      (0.15 + speedFactor * 0.04);
  });

  return (
    <group ref={groupRef} position={[0, 0.4, -1.5]}>
      <mesh>
        <icosahedronGeometry args={[0.95, 4]} />
        <meshStandardMaterial
          color={new Color("#d3c39a")}
          emissive={new Color("#66c6dc")}
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.55}
          wireframe={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.03, 24, 180]} />
        <meshBasicMaterial color="#8fe5ff" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0.4, 0.2, Math.PI / 3]}>
        <torusGeometry args={[2.15, 0.02, 24, 180]} />
        <meshBasicMaterial color="#f7c876" transparent opacity={0.36} />
      </mesh>
    </group>
  );
}

function Atmosphere() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#fff5d2" />
      <pointLight position={[-4, -1, 3]} intensity={1.3} color="#5bbfd6" />
    </>
  );
}

export function UniverseCanvas() {
  const { performanceTier, reducedMotion } = useAppState();

  const counts =
    performanceTier === "high"
      ? [4200, 2600, 1400]
      : performanceTier === "medium"
        ? [2200, 1400, 900]
        : [1000, 640, 360];

  return (
    <div className="universe-canvas">
      <Canvas camera={{ position: [0, 0, 8], fov: 48 }} dpr={[1, performanceTier === "high" ? 2 : 1.5]}>
        <color attach="background" args={["#05070c"]} />
        <fog attach="fog" args={["#05070c", 8, 24]} />
        <Atmosphere />
        <StarLayer depth={-7} count={counts[0]} size={performanceTier === "low" ? 0.02 : 0.028} tint="#6fd8ff" drift={0.45} />
        <StarLayer depth={-2} count={counts[1]} size={performanceTier === "low" ? 0.03 : 0.04} tint="#f4c37d" drift={0.28} />
        <StarLayer depth={3} count={counts[2]} size={performanceTier === "low" ? 0.035 : 0.055} tint="#ffffff" drift={0.16} />
        {!reducedMotion ? <GravityCore /> : null}
      </Canvas>
    </div>
  );
}
