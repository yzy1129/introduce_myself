import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  Points,
} from "three";
import { useRef } from "react";
import { useAppState } from "@/app/AppState";

function buildShellPoints(count: number, radius: number, variance: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(MathUtils.randFloatSpread(2));
    const shellRadius = radius + (Math.random() - 0.5) * variance;
    const sinPhi = Math.sin(phi);

    values[index * 3] = Math.cos(theta) * sinPhi * shellRadius;
    values[index * 3 + 1] = Math.cos(phi) * shellRadius * 0.92;
    values[index * 3 + 2] = Math.sin(theta) * sinPhi * shellRadius;
  }

  return values;
}

function buildOrbitDust(
  count: number,
  radiusX: number,
  radiusZ: number,
  thickness: number,
) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radialDrift = 1 + (Math.random() - 0.5) * 0.12;

    values[index * 3] =
      Math.cos(angle) * radiusX * radialDrift + (Math.random() - 0.5) * 0.05;
    values[index * 3 + 1] = (Math.random() - 0.5) * thickness;
    values[index * 3 + 2] =
      Math.sin(angle) * radiusZ * radialDrift + (Math.random() - 0.5) * 0.05;
  }

  return values;
}

function buildNebulaSwarm(count: number, radius: number, verticalSpread: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.pow(Math.random(), 0.72) * radius;
    const wobble = 0.78 + Math.random() * 0.4;

    values[index * 3] =
      Math.cos(angle) * distance * wobble + (Math.random() - 0.5) * 0.06;
    values[index * 3 + 1] = (Math.random() - 0.5) * verticalSpread;
    values[index * 3 + 2] =
      Math.sin(angle) * distance * wobble + (Math.random() - 0.5) * 0.06;
  }

  return values;
}

function dampScalarScale(
  object: { scale: { x: number; setScalar: (value: number) => void } },
  target: number,
  smoothness: number,
  delta: number,
) {
  const nextScale = MathUtils.damp(object.scale.x, target, smoothness, delta);
  object.scale.setScalar(nextScale);
}

function AvatarForm() {
  const rootRef = useRef<Group | null>(null);
  const shellHaloRef = useRef<Mesh | null>(null);
  const membraneOuterRef = useRef<Mesh | null>(null);
  const membraneInnerRef = useRef<Mesh | null>(null);
  const cageOuterRef = useRef<Mesh | null>(null);
  const cageInnerRef = useRef<Mesh | null>(null);
  const orbitAlphaRef = useRef<Mesh | null>(null);
  const orbitBetaRef = useRef<Mesh | null>(null);
  const tendrilRef = useRef<Mesh | null>(null);
  const coronaRef = useRef<Mesh | null>(null);
  const pulseRingRef = useRef<Mesh | null>(null);
  const flareAlphaRef = useRef<Mesh | null>(null);
  const flareBetaRef = useRef<Mesh | null>(null);
  const nucleusAuraRef = useRef<Mesh | null>(null);
  const nucleusRef = useRef<Mesh | null>(null);
  const organAlphaRef = useRef<Group | null>(null);
  const organBetaRef = useRef<Group | null>(null);
  const organGammaRef = useRef<Group | null>(null);
  const organDeltaRef = useRef<Group | null>(null);
  const satelliteAlphaRef = useRef<Group | null>(null);
  const satelliteBetaRef = useRef<Group | null>(null);
  const shellPointsRef = useRef<Points | null>(null);
  const orbitDustRef = useRef<Points | null>(null);
  const nebulaRef = useRef<Points | null>(null);
  const shellPositionsRef = useRef<Float32BufferAttribute | null>(null);
  const orbitDustPositionsRef = useRef<Float32BufferAttribute | null>(null);
  const nebulaPositionsRef = useRef<Float32BufferAttribute | null>(null);
  const { performanceTier, reducedMotion } = useAppState();

  const shellPointCount =
    performanceTier === "high" ? 220 : performanceTier === "medium" ? 160 : 110;
  const dustPointCount =
    performanceTier === "high" ? 280 : performanceTier === "medium" ? 200 : 130;
  const nebulaCount =
    performanceTier === "high" ? 180 : performanceTier === "medium" ? 120 : 80;

  if (!shellPositionsRef.current) {
    shellPositionsRef.current = new Float32BufferAttribute(
      buildShellPoints(shellPointCount, 1.62, 0.16),
      3,
    );
  }

  if (!orbitDustPositionsRef.current) {
    orbitDustPositionsRef.current = new Float32BufferAttribute(
      buildOrbitDust(dustPointCount, 1.78, 1.28, 0.14),
      3,
    );
  }

  if (!nebulaPositionsRef.current) {
    nebulaPositionsRef.current = new Float32BufferAttribute(
      buildNebulaSwarm(nebulaCount, 1.04, 0.78),
      3,
    );
  }

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const pulse = Math.sin(time * (reducedMotion ? 0.7 : 1.28));
    const pulsePhase = (pulse + 1) * 0.5;
    const organFlicker = reducedMotion
      ? 0.08
      : 0.08 + (Math.sin(time * 2.2) + 1) * 0.035;
    const idlePitch = reducedMotion ? 0 : Math.cos(time * 0.17) * 0.035;
    const verticalFloat = reducedMotion ? -0.02 : -0.02 + Math.sin(time * 0.46) * 0.06;
    const horizontalFloat = reducedMotion ? 0 : Math.sin(time * 0.28) * 0.06;
    const depthFloat = reducedMotion ? 0 : Math.cos(time * 0.22) * 0.04;
    const autoYawSpeed = reducedMotion ? 0.08 : 0.16;

    if (rootRef.current) {
      rootRef.current.rotation.y += delta * autoYawSpeed;
      rootRef.current.rotation.x = MathUtils.damp(
        rootRef.current.rotation.x,
        idlePitch,
        4.2,
        delta,
      );
      rootRef.current.rotation.z = MathUtils.damp(
        rootRef.current.rotation.z,
        Math.sin(time * 0.18) * 0.05,
        3.8,
        delta,
      );
      rootRef.current.position.x = MathUtils.damp(
        rootRef.current.position.x,
        horizontalFloat,
        3.2,
        delta,
      );
      rootRef.current.position.y = MathUtils.damp(
        rootRef.current.position.y,
        verticalFloat,
        2.8,
        delta,
      );
      rootRef.current.position.z = MathUtils.damp(
        rootRef.current.position.z,
        depthFloat,
        2.6,
        delta,
      );
      rootRef.current.scale.setScalar(0.76);
    }

    if (shellHaloRef.current) {
      dampScalarScale(shellHaloRef.current, 0.98 + pulsePhase * 0.18, 3.2, delta);
    }

    if (membraneOuterRef.current) {
      const outerPulse = 1 + pulse * 0.035;
      membraneOuterRef.current.rotation.y += delta * (reducedMotion ? 0.01 : 0.024);
      membraneOuterRef.current.rotation.z = MathUtils.damp(
        membraneOuterRef.current.rotation.z,
        Math.sin(time * 0.24) * 0.08,
        2.2,
        delta,
      );
      membraneOuterRef.current.scale.x = MathUtils.damp(
        membraneOuterRef.current.scale.x,
        1.04 * outerPulse,
        3.8,
        delta,
      );
      membraneOuterRef.current.scale.y = MathUtils.damp(
        membraneOuterRef.current.scale.y,
        1.11 * outerPulse,
        3.8,
        delta,
      );
      membraneOuterRef.current.scale.z = MathUtils.damp(
        membraneOuterRef.current.scale.z,
        0.98 * outerPulse,
        3.8,
        delta,
      );
    }

    if (membraneInnerRef.current) {
      const innerPulse = 1 - pulse * 0.024;
      membraneInnerRef.current.rotation.y -= delta * (reducedMotion ? 0.008 : 0.02);
      membraneInnerRef.current.rotation.x = MathUtils.damp(
        membraneInnerRef.current.rotation.x,
        Math.sin(time * 0.28) * 0.06,
        2.2,
        delta,
      );
      membraneInnerRef.current.scale.x = MathUtils.damp(
        membraneInnerRef.current.scale.x,
        0.98 * innerPulse,
        4.2,
        delta,
      );
      membraneInnerRef.current.scale.y = MathUtils.damp(
        membraneInnerRef.current.scale.y,
        1.04 * innerPulse,
        4.2,
        delta,
      );
      membraneInnerRef.current.scale.z = MathUtils.damp(
        membraneInnerRef.current.scale.z,
        0.94 * innerPulse,
        4.2,
        delta,
      );
    }

    if (cageOuterRef.current) {
      cageOuterRef.current.rotation.y += delta * (reducedMotion ? 0.016 : 0.036);
      cageOuterRef.current.rotation.z += delta * (reducedMotion ? 0.008 : 0.018);
    }

    if (cageInnerRef.current) {
      cageInnerRef.current.rotation.y -= delta * (reducedMotion ? 0.012 : 0.026);
      cageInnerRef.current.rotation.x = MathUtils.damp(
        cageInnerRef.current.rotation.x,
        Math.sin(time * 0.31) * 0.1,
        2.8,
        delta,
      );
    }

    if (orbitAlphaRef.current) {
      orbitAlphaRef.current.rotation.z += delta * (reducedMotion ? 0.05 : 0.11);
      orbitAlphaRef.current.rotation.x = MathUtils.damp(
        orbitAlphaRef.current.rotation.x,
        Math.PI / 2.42 + Math.sin(time * 0.42) * 0.08,
        3.6,
        delta,
      );
    }

    if (orbitBetaRef.current) {
      orbitBetaRef.current.rotation.y += delta * (reducedMotion ? 0.03 : 0.066);
      orbitBetaRef.current.rotation.z -= delta * (reducedMotion ? 0.02 : 0.046);
      orbitBetaRef.current.rotation.x = MathUtils.damp(
        orbitBetaRef.current.rotation.x,
        0.82 + Math.cos(time * 0.34) * 0.05,
        3,
        delta,
      );
    }

    if (tendrilRef.current) {
      tendrilRef.current.rotation.x += delta * (reducedMotion ? 0.016 : 0.034);
      tendrilRef.current.rotation.y -= delta * (reducedMotion ? 0.018 : 0.04);
      tendrilRef.current.rotation.z = MathUtils.damp(
        tendrilRef.current.rotation.z,
        Math.sin(time * 0.4) * 0.18,
        2.4,
        delta,
      );
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.z += delta * (reducedMotion ? 0.04 : 0.09);
      dampScalarScale(coronaRef.current, 0.98 + pulsePhase * 0.12, 3.8, delta);
    }

    if (pulseRingRef.current) {
      pulseRingRef.current.rotation.z -= delta * (reducedMotion ? 0.06 : 0.14);
      dampScalarScale(pulseRingRef.current, 0.94 + pulsePhase * 0.22, 4.2, delta);
    }

    if (flareAlphaRef.current) {
      flareAlphaRef.current.rotation.z += delta * (reducedMotion ? 0.05 : 0.11);
      if (!Array.isArray(flareAlphaRef.current.material)) {
        flareAlphaRef.current.material.opacity = MathUtils.damp(
          flareAlphaRef.current.material.opacity,
          0.07 + pulsePhase * 0.04,
          3.6,
          delta,
        );
      }
    }

    if (flareBetaRef.current) {
      flareBetaRef.current.rotation.z -= delta * (reducedMotion ? 0.04 : 0.08);
      if (!Array.isArray(flareBetaRef.current.material)) {
        flareBetaRef.current.material.opacity = MathUtils.damp(
          flareBetaRef.current.material.opacity,
          0.04 + pulsePhase * 0.03,
          3.6,
          delta,
        );
      }
    }

    if (nucleusAuraRef.current) {
      dampScalarScale(nucleusAuraRef.current, 1.02 + pulsePhase * 0.2, 4.1, delta);
    }

    if (nucleusRef.current) {
      dampScalarScale(nucleusRef.current, 1 + pulsePhase * 0.06, 4.4, delta);
      nucleusRef.current.rotation.y += delta * (reducedMotion ? 0.018 : 0.04);
    }

    if (organAlphaRef.current) {
      organAlphaRef.current.position.x = MathUtils.damp(
        organAlphaRef.current.position.x,
        0.16 + Math.cos(time * 0.82) * 0.14,
        3.8,
        delta,
      );
      organAlphaRef.current.position.y = MathUtils.damp(
        organAlphaRef.current.position.y,
        0.14 + Math.sin(time * 0.94) * 0.16,
        3.8,
        delta,
      );
      dampScalarScale(organAlphaRef.current, 1 + organFlicker * 0.9, 5.2, delta);
    }

    if (organBetaRef.current) {
      organBetaRef.current.position.x = MathUtils.damp(
        organBetaRef.current.position.x,
        -0.22 + Math.sin(time * 0.68) * 0.1,
        3.8,
        delta,
      );
      organBetaRef.current.position.z = MathUtils.damp(
        organBetaRef.current.position.z,
        -0.12 + Math.cos(time * 1.06) * 0.14,
        3.8,
        delta,
      );
      dampScalarScale(organBetaRef.current, 1 + organFlicker * 0.7, 5.2, delta);
    }

    if (organGammaRef.current) {
      organGammaRef.current.position.y = MathUtils.damp(
        organGammaRef.current.position.y,
        -0.2 + Math.sin(time * 0.76) * 0.1,
        3.8,
        delta,
      );
      organGammaRef.current.position.x = MathUtils.damp(
        organGammaRef.current.position.x,
        0.24 + Math.cos(time * 0.58) * 0.08,
        3.8,
        delta,
      );
      dampScalarScale(organGammaRef.current, 1 + organFlicker * 0.8, 5.2, delta);
    }

    if (organDeltaRef.current) {
      organDeltaRef.current.position.z = MathUtils.damp(
        organDeltaRef.current.position.z,
        0.14 + Math.sin(time * 0.88) * 0.1,
        3.8,
        delta,
      );
      organDeltaRef.current.position.x = MathUtils.damp(
        organDeltaRef.current.position.x,
        -0.06 + Math.cos(time * 0.7) * 0.12,
        3.8,
        delta,
      );
      dampScalarScale(organDeltaRef.current, 1 + organFlicker * 0.75, 5.2, delta);
    }

    if (satelliteAlphaRef.current) {
      satelliteAlphaRef.current.rotation.z += delta * (reducedMotion ? 0.12 : 0.26);
    }

    if (satelliteBetaRef.current) {
      satelliteBetaRef.current.rotation.z -= delta * (reducedMotion ? 0.08 : 0.18);
    }

    if (shellPointsRef.current) {
      shellPointsRef.current.rotation.y += delta * (reducedMotion ? 0.012 : 0.026);
      shellPointsRef.current.rotation.z += delta * 0.008;
    }

    if (orbitDustRef.current) {
      orbitDustRef.current.rotation.z -= delta * (reducedMotion ? 0.016 : 0.038);
      orbitDustRef.current.rotation.x = MathUtils.damp(
        orbitDustRef.current.rotation.x,
        Math.PI / 2.8 + Math.sin(time * 0.35) * 0.06,
        2.8,
        delta,
      );
    }

    if (nebulaRef.current) {
      nebulaRef.current.rotation.y -= delta * (reducedMotion ? 0.02 : 0.05);
      nebulaRef.current.rotation.x += delta * (reducedMotion ? 0.01 : 0.024);
      nebulaRef.current.rotation.z = MathUtils.damp(
        nebulaRef.current.rotation.z,
        Math.cos(time * 0.26) * 0.14,
        2.4,
        delta,
      );
    }
  });

  return (
    <group ref={rootRef}>
      <points ref={shellPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[shellPositionsRef.current.array, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#9cecff"
          size={0.026}
          sizeAttenuation
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <points ref={orbitDustRef} rotation={[Math.PI / 2.8, 0.24, 0.1]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[orbitDustPositionsRef.current.array, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#d7c5ff"
          size={0.022}
          sizeAttenuation
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <points ref={nebulaRef} rotation={[0.34, 0.18, 0.22]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nebulaPositionsRef.current.array, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8fe6ff"
          size={0.034}
          sizeAttenuation
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <mesh ref={shellHaloRef}>
        <sphereGeometry args={[1.24, 34, 34]} />
        <meshBasicMaterial
          color="#64ddff"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={membraneOuterRef}>
        <sphereGeometry args={[1.28, 56, 56]} />
        <meshPhysicalMaterial
          color="#133042"
          emissive="#5fddff"
          emissiveIntensity={0.14}
          roughness={0.12}
          metalness={0.02}
          clearcoat={0.92}
          clearcoatRoughness={0.12}
          transmission={0.18}
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh ref={membraneInnerRef}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshPhysicalMaterial
          color="#102636"
          emissive="#7ce7ff"
          emissiveIntensity={0.1}
          roughness={0.18}
          metalness={0.02}
          clearcoat={0.68}
          clearcoatRoughness={0.16}
          transmission={0.1}
          transparent
          opacity={0.1}
        />
      </mesh>

      <mesh ref={cageOuterRef}>
        <icosahedronGeometry args={[1.64, 4]} />
        <meshStandardMaterial
          color="#0f2433"
          emissive="#4dd7ff"
          emissiveIntensity={0.22}
          roughness={0.3}
          metalness={0.44}
          transparent
          opacity={0.22}
          wireframe
        />
      </mesh>

      <mesh ref={cageInnerRef}>
        <icosahedronGeometry args={[1.34, 3]} />
        <meshStandardMaterial
          color="#112939"
          emissive="#78e6ff"
          emissiveIntensity={0.12}
          roughness={0.34}
          metalness={0.24}
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>

      <mesh ref={orbitAlphaRef} rotation={[Math.PI / 2.42, 0.22, 0.14]}>
        <torusGeometry args={[1.74, 0.012, 20, 200]} />
        <meshStandardMaterial
          color="#c6f6ff"
          emissive="#c6f6ff"
          emissiveIntensity={0.42}
          transparent
          opacity={0.38}
        />
      </mesh>

      <mesh ref={orbitBetaRef} rotation={[0.82, 0.18, Math.PI / 3.3]}>
        <torusGeometry args={[1.52, 0.012, 18, 180]} />
        <meshStandardMaterial
          color="#7e69b8"
          emissive="#b497ff"
          emissiveIntensity={0.26}
          transparent
          opacity={0.24}
        />
      </mesh>

      <mesh ref={coronaRef} rotation={[Math.PI / 2.1, 0.28, Math.PI / 8]}>
        <torusGeometry args={[0.94, 0.03, 20, 160]} />
        <meshBasicMaterial
          color="#68ddff"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0.1, 0]}>
        <torusGeometry args={[0.8, 0.008, 18, 180]} />
        <meshBasicMaterial
          color="#c7f6ff"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={flareAlphaRef} rotation={[0.22, 0.18, Math.PI / 4]}>
        <planeGeometry args={[1.7, 0.08]} />
        <meshBasicMaterial
          color="#8fe6ff"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={flareBetaRef} rotation={[-0.24, 0.08, Math.PI / 1.45]}>
        <planeGeometry args={[1.18, 0.05]} />
        <meshBasicMaterial
          color="#d6b0ff"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={tendrilRef} rotation={[0.56, 0.34, 0.18]}>
        <torusKnotGeometry args={[0.84, 0.014, 220, 24, 2, 5]} />
        <meshStandardMaterial
          color="#8ae8ff"
          emissive="#8ae8ff"
          emissiveIntensity={0.34}
          transparent
          opacity={0.18}
        />
      </mesh>

      <mesh ref={nucleusAuraRef}>
        <sphereGeometry args={[0.72, 34, 34]} />
        <meshBasicMaterial
          color="#7de8ff"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh ref={nucleusRef}>
        <sphereGeometry args={[0.54, 46, 46]} />
        <meshStandardMaterial
          color="#c2b487"
          emissive="#ffd9a8"
          emissiveIntensity={0.24}
          roughness={0.36}
          metalness={0.06}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.14, 22, 22]} />
        <meshBasicMaterial
          color="#fff9f0"
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <group ref={organAlphaRef} position={[0.18, 0.14, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color="#6bdfff"
            emissive="#6bdfff"
            emissiveIntensity={1.2}
            roughness={0.16}
            metalness={0.04}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshBasicMaterial
            color="#6bdfff"
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh position={[0.03, -0.02, 0.02]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#f8ffff" />
        </mesh>
      </group>

      <group ref={organBetaRef} position={[-0.22, 0.04, -0.12]}>
        <mesh>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial
            color="#b58cff"
            emissive="#c8a4ff"
            emissiveIntensity={0.96}
            roughness={0.18}
            metalness={0.06}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshBasicMaterial
            color="#c8a4ff"
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh position={[-0.02, 0.01, -0.01]}>
          <sphereGeometry args={[0.032, 14, 14]} />
          <meshBasicMaterial color="#fff5ff" />
        </mesh>
      </group>

      <group ref={organGammaRef} position={[0.22, -0.18, 0.08]}>
        <mesh>
          <sphereGeometry args={[0.095, 22, 22]} />
          <meshStandardMaterial
            color="#ffd78d"
            emissive="#ffd78d"
            emissiveIntensity={0.84}
            roughness={0.22}
            metalness={0.04}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.18, 22, 22]} />
          <meshBasicMaterial
            color="#ffd78d"
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh position={[0.02, -0.01, 0.01]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#fff8ea" />
        </mesh>
      </group>

      <group ref={organDeltaRef} position={[-0.04, 0.02, 0.14]}>
        <mesh>
          <sphereGeometry args={[0.09, 22, 22]} />
          <meshStandardMaterial
            color="#8de6ca"
            emissive="#8de6ca"
            emissiveIntensity={0.88}
            roughness={0.18}
            metalness={0.04}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.17, 22, 22]} />
          <meshBasicMaterial
            color="#8de6ca"
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh position={[0.01, 0.02, 0]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshBasicMaterial color="#f4fff9" />
        </mesh>
      </group>

      <group ref={satelliteAlphaRef} rotation={[Math.PI / 2.42, 0.22, 0.14]}>
        <mesh position={[1.74, 0, 0]}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[1.74, 0, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial
            color="#8fe6ff"
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>

      <group ref={satelliteBetaRef} rotation={[0.82, 0.18, Math.PI / 3.3]}>
        <mesh position={[-1.52, 0, 0]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshBasicMaterial color="#ffebc8" />
        </mesh>
        <mesh position={[-1.52, 0, 0]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshBasicMaterial
            color="#ffd8a2"
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

export function AboutAvatarScene() {
  const { performanceTier } = useAppState();

  return (
    <div className="about-avatar-scene">
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 36 }}
        dpr={[1, performanceTier === "high" ? 2 : 1.6]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.28} />
        <directionalLight
          position={[2.6, 3.2, 3.6]}
          intensity={0.92}
          color="#fff1d6"
        />
        <pointLight
          position={[-3.2, 0.8, 2.2]}
          intensity={1.08}
          color="#59dbff"
        />
        <pointLight
          position={[0.9, -2.2, -1.8]}
          intensity={0.54}
          color="#9d7eff"
        />
        <fog attach="fog" args={["#07101a", 4.8, 9.8]} />
        <AvatarForm />
      </Canvas>
    </div>
  );
}
