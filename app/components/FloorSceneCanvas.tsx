"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
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

function samplePath(points: THREE.Vector3[], progress: number, target: THREE.Vector3) {
  const scaled = THREE.MathUtils.clamp(progress, 0, 1) * (points.length - 1);
  const index = Math.min(Math.floor(scaled), points.length - 2);
  const localProgress = smoothstep(0, 1, scaled - index);
  target.lerpVectors(points[index], points[index + 1], localProgress);
}

function StoryScene({ progress, reducedMotion, mobilePerformanceMode }: { progress: MotionValue<number>; reducedMotion: boolean; mobilePerformanceMode: boolean }) {
  const group = useRef<THREE.Group>(null);
  const boardRefs = useRef<(THREE.Mesh | null)[]>([]);
  const subfloorMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const guideRef = useRef<THREE.GridHelper>(null);
  const trimGroup = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.Fog>(null);
  const backgroundRef = useRef<THREE.Color>(null);
  const { invalidate, size } = useThree();
  const mobile = mobilePerformanceMode || size.width < 720;
  const boardCount = mobilePerformanceMode ? 8 : mobile ? 10 : 15;

  useEffect(() => {
    if (!mobilePerformanceMode) return;
    const unsubscribe = progress.on("change", () => invalidate());
    invalidate();
    return unsubscribe;
  }, [invalidate, mobilePerformanceMode, progress]);

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
  const cameraPath = useMemo(() => (mobile ? [
    new THREE.Vector3(8.8, 8.4, 17),
    new THREE.Vector3(7.4, 7.7, 15.3),
    new THREE.Vector3(6.3, 7, 13.7),
    new THREE.Vector3(5.2, 6.4, 12.2),
    new THREE.Vector3(4.1, 6.9, 11.1),
    new THREE.Vector3(2.8, 7.7, 10.4),
  ] : [
    new THREE.Vector3(9.4, 7.6, 14.5),
    new THREE.Vector3(8, 6.9, 12.7),
    new THREE.Vector3(6.5, 5.9, 10.6),
    new THREE.Vector3(5.2, 4.9, 8.8),
    new THREE.Vector3(3.6, 5.5, 7.5),
    new THREE.Vector3(1.8, 6.5, 7),
  ]), [mobile]);
  const lookPath = useMemo(() => [
    new THREE.Vector3(0, 1.7, 0),
    new THREE.Vector3(0, 1.15, 0),
    new THREE.Vector3(0, 0.7, -0.05),
    new THREE.Vector3(0, 0.35, -0.2),
    new THREE.Vector3(0, 0.08, -0.4),
    new THREE.Vector3(0, 0, -0.55),
  ], []);

  useFrame(({ camera, clock }) => {
    const raw = progress.get();
    const align = smoothstep(0.42, 0.72, raw);
    const finish = smoothstep(0.72, 0.94, raw);
    const baseReveal = smoothstep(0.02, 0.24, raw);
    const time = clock.getElapsedTime();

    boardRefs.current.forEach((board, index) => {
      if (!board) return;
      const spec = specs[index];
      const delay = (index / Math.max(boardCount - 1, 1)) * 0.18;
      const boardApproach = smoothstep(0.2 + delay, 0.54 + delay, raw);
      const boardAlign = smoothstep(0.35 + delay, 0.66 + delay, raw);
      const floatingY = reducedMotion || mobilePerformanceMode ? 0 : Math.sin(time * 0.7 + index * 0.68) * 0.16 * (1 - boardAlign);
      const driftX = reducedMotion || mobilePerformanceMode ? 0 : Math.sin(time * 0.35 + index) * 0.08 * (1 - boardApproach);
      board.position.x = THREE.MathUtils.lerp(spec.initial[0] + driftX, spec.target[0], boardApproach);
      board.position.y = THREE.MathUtils.lerp(spec.initial[1] + floatingY, spec.target[1], boardApproach);
      board.position.z = THREE.MathUtils.lerp(spec.initial[2], spec.target[2], boardApproach);
      board.rotation.x = THREE.MathUtils.lerp(spec.initialRotation[0], 0, boardAlign);
      board.rotation.y = THREE.MathUtils.lerp(spec.initialRotation[1], 0, boardAlign);
      board.rotation.z = THREE.MathUtils.lerp(spec.initialRotation[2], 0, boardAlign);
      const snapStart = 0.54 + delay;
      const snap = raw > snapStart && raw < snapStart + 0.12 ? Math.sin((raw - snapStart) * Math.PI / 0.12) * 0.08 : 0;
      board.position.y += snap * (index % 2 === 0 ? 1 : 0.55);
    });

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-0.18, 0.03, align);
      group.current.position.z = THREE.MathUtils.lerp(0, 0.45, finish);
    }
    if (subfloorMaterial.current) subfloorMaterial.current.opacity = THREE.MathUtils.lerp(0.04, 0.42, baseReveal);
    if (guideRef.current) {
      const material = guideRef.current.material;
      const opacity = baseReveal * (1 - finish) * 0.34;
      const materials = Array.isArray(material) ? material : [material];
      materials.forEach((item) => {
        item.transparent = true;
        item.opacity = opacity;
      });
    }
    if (trimGroup.current) {
      trimGroup.current.visible = finish > 0.01;
      trimGroup.current.position.y = THREE.MathUtils.lerp(-0.2, 0.12, finish);
      trimGroup.current.scale.y = finish;
    }
    samplePath(cameraPath, raw, cameraTarget);
    samplePath(lookPath, raw, lookTarget);
    if (mobilePerformanceMode) camera.position.copy(cameraTarget);
    else camera.position.lerp(cameraTarget, 0.06);
    camera.lookAt(lookTarget);
    backgroundColor.lerpColors(backgroundStart, backgroundEnd, finish);
    if (backgroundRef.current) backgroundRef.current.copy(backgroundColor);
    if (fogRef.current) fogRef.current.color.copy(backgroundColor);
  });

  return (
    <>
      <color ref={backgroundRef} attach="background" args={["#151513"]} />
      <fog ref={fogRef} attach="fog" args={["#151513", 14, 29]} />
      <ambientLight intensity={0.58} />
      <hemisphereLight args={["#fff0da", "#171411", 1.35]} />
      <directionalLight position={[5, 11, 7]} intensity={2.8} color="#ffe2bd" castShadow={!mobilePerformanceMode} shadow-mapSize-width={mobile ? 512 : 1024} shadow-mapSize-height={mobile ? 512 : 1024} shadow-camera-far={28} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.00018} />
      <pointLight position={[-8, 4, 3]} intensity={24} distance={18} color="#c75f2f" />
      <spotLight position={[2, 10, -7]} angle={0.48} penumbra={0.85} intensity={13} distance={26} color="#fff2dd" />
      <group ref={group}>
        {specs.map((spec, index) => (
          <RoundedBox key={index} ref={(mesh) => { boardRefs.current[index] = mesh; }} args={[mobile ? 3.35 : 4.05, 0.18, 0.76]} radius={0.04} smoothness={2} position={spec.initial} rotation={spec.initialRotation} castShadow={!mobilePerformanceMode} receiveShadow={!mobilePerformanceMode}>
            <meshStandardMaterial color={spec.color} roughness={0.48} metalness={0.035} />
          </RoundedBox>
        ))}
      </group>
      <gridHelper ref={guideRef} args={[mobile ? 8.2 : 14.2, mobile ? 8 : 14, "#d28759", "#6f665b"]} position={[0, 0.045, -0.2]} />
      <mesh position={[0, -0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!mobilePerformanceMode}>
        <planeGeometry args={[mobile ? 10.5 : 15.5, 8.2]} />
        <meshStandardMaterial ref={subfloorMaterial} color="#7f766a" transparent opacity={0.04} roughness={0.9} />
      </mesh>
      <group ref={trimGroup} visible={false}>
        <RoundedBox args={[mobile ? 8.1 : 13.5, 0.13, 0.12]} radius={0.025} smoothness={2} position={[0.15, 0, mobile ? -2.42 : -2.44]}>
          <meshStandardMaterial color="#ead2b7" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[mobile ? 8.1 : 13.5, 0.13, 0.12]} radius={0.025} smoothness={2} position={[0.15, 0, mobile ? 0.96 : 1.8]}>
          <meshStandardMaterial color="#ead2b7" roughness={0.6} />
        </RoundedBox>
      </group>
      {mobilePerformanceMode ? null : <ContactShadows position={[0, 0.02, 0]} opacity={0.42} scale={18} blur={2.2} far={5} />}
    </>
  );
}

export function FloorSceneCanvas({ progress, reducedMotion, mobilePerformanceMode }: { progress: MotionValue<number>; reducedMotion: boolean; mobilePerformanceMode: boolean }) {
  return (
    <Canvas
      shadows={!mobilePerformanceMode}
      dpr={mobilePerformanceMode ? 1 : [1, 1.45]}
      frameloop={mobilePerformanceMode ? "demand" : "always"}
      camera={{ position: [9.4, 7.6, 14.5], fov: 36, near: 0.1, far: 70 }}
      gl={{ antialias: !mobilePerformanceMode, alpha: false, powerPreference: "high-performance" }}
    >
      <StoryScene progress={progress} reducedMotion={reducedMotion} mobilePerformanceMode={mobilePerformanceMode} />
    </Canvas>
  );
}
