"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type PlankSpec = {
  initial: [number, number, number];
  initialRotation: [number, number, number];
  target: [number, number, number];
  color: string;
};

const initialPositions: [number, number, number][] = [
  [-6.5, 4.7, -1.6], [-2.4, 6.2, 1.8], [3.2, 5.4, -2.8], [6.6, 3.8, 1.1], [-5.2, 1.8, 3.6],
  [0.4, 3.4, 4.1], [5.7, 1.3, -3.5], [-3.2, 5.3, -4.5], [2.1, 6.7, 3.8], [7.2, 5.2, 4.3],
  [-7.4, 2.7, -4.2], [-0.8, 1.5, -4.8], [4.1, 3.1, 4.9], [-4.7, 6.5, 4.8], [6.8, 6.1, -1.1],
];

const rotations: [number, number, number][] = [
  [0.4, -0.8, 0.32], [-0.35, 0.55, -0.22], [0.25, 0.9, 0.18], [-0.5, -0.38, 0.28], [0.38, 0.44, -0.36],
  [-0.2, -0.75, 0.14], [0.5, 0.62, 0.31], [-0.45, 0.25, -0.2], [0.18, -0.52, 0.4], [-0.32, 0.82, -0.15],
  [0.55, -0.3, 0.23], [-0.2, 0.65, -0.38], [0.42, -0.9, 0.12], [-0.38, 0.35, 0.34], [0.26, 0.72, -0.27],
];

const colors = ["#b97843", "#c98e57", "#d8aa76", "#bd7d49", "#d2a06a", "#e0b889"];

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function StoryScene({ progress, reducedMotion }: { progress: MotionValue<number>; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const boardRefs = useRef<(THREE.Mesh | null)[]>([]);
  const subfloorMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const fogRef = useRef<THREE.Fog>(null);
  const { size, scene } = useThree();
  const mobile = size.width < 720;
  const boardCount = mobile ? 10 : 15;

  const specs = useMemo<PlankSpec[]>(() => Array.from({ length: boardCount }, (_, index) => {
    const row = Math.floor(index / (mobile ? 2 : 3));
    const column = index % (mobile ? 2 : 3);
    const xSpacing = mobile ? 3.75 : 4.25;
    const xBase = mobile ? -1.9 : -4.25;
    const stagger = row % 2 === 0 ? 0 : mobile ? 0.55 : 0.72;
    return {
      initial: initialPositions[index],
      initialRotation: rotations[index],
      target: [xBase + column * xSpacing + stagger, 0.13, -2 + row * 0.84],
      color: colors[index % colors.length],
    };
  }), [boardCount, mobile]);

  const backgroundStart = useMemo(() => new THREE.Color("#151513"), []);
  const backgroundEnd = useMemo(() => new THREE.Color("#28241f"), []);
  const backgroundColor = useMemo(() => new THREE.Color(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }) => {
    const raw = progress.get();
    const approach = smoothstep(0.15, 0.48, raw);
    const align = smoothstep(0.42, 0.72, raw);
    const finish = smoothstep(0.72, 0.94, raw);
    const time = clock.getElapsedTime();

    boardRefs.current.forEach((board, index) => {
      if (!board) return;
      const spec = specs[index];
      const floatingY = reducedMotion ? 0 : Math.sin(time * 0.7 + index * 0.68) * 0.16 * (1 - align);
      const driftX = reducedMotion ? 0 : Math.sin(time * 0.35 + index) * 0.08 * (1 - approach);
      board.position.x = THREE.MathUtils.lerp(spec.initial[0] + driftX, spec.target[0], approach);
      board.position.y = THREE.MathUtils.lerp(spec.initial[1] + floatingY, spec.target[1], approach);
      board.position.z = THREE.MathUtils.lerp(spec.initial[2], spec.target[2], approach);
      board.rotation.x = THREE.MathUtils.lerp(spec.initialRotation[0], 0, align);
      board.rotation.y = THREE.MathUtils.lerp(spec.initialRotation[1], 0, align);
      board.rotation.z = THREE.MathUtils.lerp(spec.initialRotation[2], 0, align);
      const snap = raw > 0.61 && raw < 0.75 ? Math.sin((raw - 0.61) * Math.PI / 0.14) * 0.08 : 0;
      board.position.y += snap * (index % 2 === 0 ? 1 : 0.55);
    });

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-0.18, 0.03, align);
      group.current.position.z = THREE.MathUtils.lerp(0, 0.45, finish);
    }
    if (subfloorMaterial.current) subfloorMaterial.current.opacity = THREE.MathUtils.lerp(0.04, 0.34, align);

    if (raw < 0.5) {
      const t = smoothstep(0, 0.5, raw);
      cameraTarget.set(THREE.MathUtils.lerp(9.4, 6.3, t), THREE.MathUtils.lerp(7.6, 5.7, t), THREE.MathUtils.lerp(14.5, 9.5, t));
      lookTarget.set(0, THREE.MathUtils.lerp(1.7, 0.6, t), 0);
    } else {
      const t = smoothstep(0.5, 1, raw);
      cameraTarget.set(THREE.MathUtils.lerp(6.3, 0.8, t), THREE.MathUtils.lerp(5.7, 6.3, t), THREE.MathUtils.lerp(9.5, 9.2, t));
      lookTarget.set(0, THREE.MathUtils.lerp(0.6, 0, t), THREE.MathUtils.lerp(0, -0.1, t));
    }
    camera.position.lerp(cameraTarget, 0.06);
    camera.lookAt(lookTarget);
    backgroundColor.lerpColors(backgroundStart, backgroundEnd, finish);
    scene.background = backgroundColor;
    if (fogRef.current) fogRef.current.color.copy(backgroundColor);
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#151513", 14, 29]} />
      <ambientLight intensity={0.58} />
      <hemisphereLight args={["#fff0da", "#171411", 1.35]} />
      <directionalLight position={[5, 11, 7]} intensity={2.8} color="#ffe2bd" castShadow shadow-mapSize-width={mobile ? 512 : 1024} shadow-mapSize-height={mobile ? 512 : 1024} shadow-camera-far={28} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.00018} />
      <pointLight position={[-8, 4, 3]} intensity={24} distance={18} color="#c75f2f" />
      <spotLight position={[2, 10, -7]} angle={0.48} penumbra={0.85} intensity={13} distance={26} color="#fff2dd" />
      <group ref={group}>
        {specs.map((spec, index) => (
          <RoundedBox key={index} ref={(mesh) => { boardRefs.current[index] = mesh; }} args={[mobile ? 3.35 : 4.05, 0.18, 0.76]} radius={0.04} smoothness={2} position={spec.initial} rotation={spec.initialRotation} castShadow receiveShadow>
            <meshStandardMaterial color={spec.color} roughness={0.48} metalness={0.035} />
          </RoundedBox>
        ))}
      </group>
      <mesh position={[0, -0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[mobile ? 10.5 : 15.5, 8.2]} />
        <meshStandardMaterial ref={subfloorMaterial} color="#7f766a" transparent opacity={0.04} roughness={0.9} />
      </mesh>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.42} scale={18} blur={2.2} far={5} />
    </>
  );
}

export function FloorSceneCanvas({ progress, reducedMotion }: { progress: MotionValue<number>; reducedMotion: boolean }) {
  return (
    <Canvas shadows dpr={[1, 1.45]} camera={{ position: [9.4, 7.6, 14.5], fov: 36, near: 0.1, far: 70 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
      <StoryScene progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
