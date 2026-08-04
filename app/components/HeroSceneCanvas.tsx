"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const heroPlanks = [
  { position: [-3.3, 2.2, 0.2], rotation: [0.08, -0.25, -0.08], color: "#c8925f", phase: 0.2 },
  { position: [0.2, 3.15, -1.4], rotation: [-0.08, 0.18, 0.04], color: "#ddb383", phase: 1.1 },
  { position: [3.25, 1.9, 0.55], rotation: [0.12, -0.12, 0.1], color: "#b97948", phase: 2.4 },
  { position: [-2.35, 0.55, 1.85], rotation: [-0.08, 0.2, -0.04], color: "#d2a06d", phase: 1.8 },
  { position: [1.25, 0.7, 1.45], rotation: [0.05, -0.28, 0.04], color: "#c18450", phase: 0.7 },
  { position: [3.9, -0.05, -0.7], rotation: [0.1, 0.1, -0.05], color: "#e0b98b", phase: 2.8 },
  { position: [-3.6, -1.1, -0.2], rotation: [-0.04, -0.16, 0.08], color: "#b87342", phase: 1.35 },
  { position: [-0.15, -1.25, 0.55], rotation: [0.08, 0.24, -0.04], color: "#d7a875", phase: 2.1 },
  { position: [3.0, -1.5, 1.25], rotation: [-0.08, -0.18, 0.07], color: "#c68b57", phase: 0.4 },
] as const;

function HeroPlank({
  position,
  rotation,
  color,
  phase,
  reducedMotion,
}: {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  color: string;
  phase: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(time * 0.72 + phase) * 0.12;
    ref.current.rotation.z = rotation[2] + Math.sin(time * 0.46 + phase) * 0.018;
  });

  return (
    <RoundedBox ref={ref} args={[3.7, 0.16, 0.74]} radius={0.045} smoothness={2} position={[...position]} rotation={[...rotation]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.04} />
    </RoundedBox>
  );
}

function Scene({ reducedMotion, mobilePerformanceMode }: { reducedMotion: boolean; mobilePerformanceMode: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer, clock, camera }) => {
    if (!group.current) return;
    if (mobilePerformanceMode) {
      camera.lookAt(0, 1.7, 0);
      return;
    }
    const time = clock.getElapsedTime();
    const mobile = size.width < 640;
    const pointerX = reducedMotion ? 0 : pointer.x;
    const pointerY = reducedMotion ? 0 : pointer.y;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.32 + pointerX * 0.08, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.06 - pointerY * 0.045, 0.035);
    group.current.position.x = mobile ? 0 : 1.25;
    group.current.position.y = (mobile ? 2 : 0) + (reducedMotion ? 0 : Math.sin(time * 0.35) * 0.08);
    group.current.scale.setScalar(mobile ? 0.7 : 1);
    cameraTarget.set(mobile ? 5.8 : 7.8, mobile ? 5.2 : 4.8, mobile ? 13.8 : 11.8);
    camera.position.lerp(cameraTarget, 0.08);
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = mobile ? 42 : 34;
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.08);
        camera.updateProjectionMatrix();
      }
    }
    camera.lookAt(mobile ? 0 : 0.35, mobile ? 1.7 : 0.45, 0);
  });

  return (
    <>
      <color attach="background" args={["#e8e1d5"]} />
      <fog attach="fog" args={["#e8e1d5", 13, 24]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[5, 9, 7]} intensity={2.7} color="#fff3df" castShadow={!mobilePerformanceMode} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.00015} />
      <pointLight position={[-5, 2, 4]} intensity={13} distance={13} color="#d76f38" />
      <group
        ref={group}
        position={mobilePerformanceMode ? [0, 2, 0] : [1.25, 0, 0]}
        rotation={mobilePerformanceMode ? [0.06, -0.32, 0] : [0, 0, 0]}
        scale={mobilePerformanceMode ? 0.7 : 1}
      >
        {heroPlanks.map((plank, index) => <HeroPlank key={index} {...plank} reducedMotion={reducedMotion || mobilePerformanceMode} />)}
      </group>
      {mobilePerformanceMode ? null : <ContactShadows position={[0, -2.05, 0]} opacity={0.3} scale={15} blur={2.8} far={8} />}
    </>
  );
}

export function HeroSceneCanvas({ reducedMotion, mobilePerformanceMode }: { reducedMotion: boolean; mobilePerformanceMode: boolean }) {
  return (
    <Canvas
      key={mobilePerformanceMode ? "mobile" : "desktop"}
      shadows={!mobilePerformanceMode}
      dpr={mobilePerformanceMode ? 1 : [1, 1.5]}
      frameloop={mobilePerformanceMode ? "demand" : "always"}
      camera={{ position: mobilePerformanceMode ? [5.8, 5.2, 13.8] : [7.8, 4.8, 11.8], fov: mobilePerformanceMode ? 42 : 34, near: 0.1, far: 60 }}
      gl={{ antialias: !mobilePerformanceMode, alpha: false, powerPreference: "high-performance" }}
    >
      <Scene reducedMotion={reducedMotion} mobilePerformanceMode={mobilePerformanceMode} />
    </Canvas>
  );
}
