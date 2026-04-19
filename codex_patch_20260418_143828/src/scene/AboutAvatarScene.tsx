import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  Points,
} from "three";
import { useRef } from "react";
import { useAppState } from "@/app/AppState";

function buildAuraPositions(count: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const radius = 1.5 + ((index % 6) / 6) * 0.55;

    values[index * 3] = Math.cos(angle) * radius;
    values[index * 3 + 1] = (Math.random() - 0.5) * 1.9;
    values[index * 3 + 2] = Math.sin(angle) * radius * 0.35;
  }

  return values;
}

function AvatarForm() {
  const shellRef = useRef<Mesh | null>(null);
  const coreRef = useRef<Mesh | null>(null);
  const ringRef = useRef<Mesh | null>(null);
  const particleRef = useRef<Points | null>(null);
  const auraPositionsRef = useRef<Float32BufferAttribute | null>(null);
  const { pointerRef, reducedMotion } = useAppState();

  if (!auraPositionsRef.current) {
    auraPositionsRef.current = new Float32BufferAttribute(
      buildAuraPositions(120),
      3,
    );
  }

  useFrame((state, delta) => {
    const pointer = pointerRef.current;
    const pointerX = pointer.active ? pointer.x : window.innerWidth * 0.5;
    const pointerY = pointer.active ? pointer.y : window.innerHeight * 0.5;
    const targetYaw = MathUtils.mapLinear(
      pointerX,
      0,
      window.innerWidth,
      -0.35,
      0.35,
    );
    const targetPitch = MathUtils.mapLinear(
      pointerY,
      0,
      window.innerHeight,
      0.22,
      -0.22,
    );

    if (shellRef.current) {
      shellRef.current.rotation.y = MathUtils.lerp(
        shellRef.current.rotation.y,
        targetYaw,
        delta * 2.2,
      );
      shellRef.current.rotation.x = MathUtils.lerp(
        shellRef.current.rotation.x,
        targetPitch,
        delta * 2,
      );
      shellRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.05) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = MathUtils.lerp(
        coreRef.current.rotation.y,
        targetYaw * 0.82,
        delta * 2.3,
      );
      coreRef.current.rotation.x = MathUtils.lerp(
        coreRef.current.rotation.x,
        targetPitch * 0.78,
        delta * 2.1,
      );
      coreRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 1.45) * 0.045,
      );
      coreRef.current.position.x = MathUtils.lerp(
        coreRef.current.position.x,
        targetYaw * 0.24,
        delta * 1.6,
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (reducedMotion ? 0.08 : 0.16);
      ringRef.current.rotation.x = MathUtils.lerp(
        ringRef.current.rotation.x,
        targetPitch * 0.5 + Math.PI / 2,
        delta * 1.4,
      );
    }

    if (particleRef.current) {
      particleRef.current.rotation.y -= delta * (reducedMotion ? 0.05 : 0.12);
      particleRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group>
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[auraPositionsRef.current.array, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8fe5ff"
          size={0.036}
          sizeAttenuation
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.12, 3]} />
        <meshStandardMaterial
          color="#112231"
          emissive="#66dfff"
          emissiveIntensity={0.46}
          roughness={0.24}
          metalness={0.72}
          wireframe
        />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.54, 32, 32]} />
        <meshStandardMaterial
          color="#d9c693"
          emissive="#ffd68a"
          emissiveIntensity={0.28}
          roughness={0.3}
          metalness={0.18}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0.6, 0]}>
        <torusGeometry args={[1.72, 0.03, 24, 160]} />
        <meshStandardMaterial
          color="#90e7ff"
          emissive="#90e7ff"
          emissiveIntensity={0.88}
        />
      </mesh>

      <mesh rotation={[0.32, 0.32, Math.PI / 3]}>
        <torusGeometry args={[2.12, 0.018, 20, 160]} />
        <meshStandardMaterial
          color="#c89dff"
          emissive="#c89dff"
          emissiveIntensity={0.62}
          transparent
          opacity={0.84}
        />
      </mesh>
    </group>
  );
}

export function AboutAvatarScene() {
  const { reducedMotion, performanceTier } = useAppState();

  return (
    <div className="about-avatar-scene">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        dpr={[1, performanceTier === "high" ? 2 : 1.6]}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 3, 3]} intensity={1.35} color="#fff2d0" />
        <pointLight position={[-3, -2, 1]} intensity={1.25} color="#4bc6ff" />
        {!reducedMotion ? <AvatarForm /> : null}
        {reducedMotion ? (
          <mesh>
            <icosahedronGeometry args={[1.1, 2]} />
            <meshStandardMaterial
              color="#133041"
              emissive="#7fe6ff"
              emissiveIntensity={0.34}
              wireframe
            />
          </mesh>
        ) : null}
      </Canvas>
    </div>
  );
}
