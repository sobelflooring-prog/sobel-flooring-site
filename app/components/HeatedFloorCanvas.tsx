"use client";

import { ContactShadows, RoundedBox, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function createSerpentineCurve() {
  const points: THREE.Vector3[] = [];
  const lanes = 8;
  const zStart = -2.05;
  const zStep = 0.58;

  for (let lane = 0; lane < lanes; lane += 1) {
    const z = zStart + lane * zStep;
    const direction = lane % 2 === 0 ? 1 : -1;
    const startX = direction === 1 ? -5.15 : 5.15;
    const endX = -startX;
    points.push(new THREE.Vector3(startX, 0, z));
    points.push(new THREE.Vector3(endX * 0.82, 0, z));
    points.push(new THREE.Vector3(endX, 0, z));
    if (lane < lanes - 1) points.push(new THREE.Vector3(endX, 0, z + zStep));
  }

  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.45);
}

function HeatedFloorModel({ temperature, reducedMotion }: { temperature: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const cableMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const heatLight = useRef<THREE.PointLight>(null);
  const { size } = useThree();
  const mobile = size.width < 680;
  const sourceTexture = useTexture("/vinyl-grain.jpg");
  const texture = useMemo(() => {
    const clonedTexture = sourceTexture.clone();
    clonedTexture.wrapS = THREE.RepeatWrapping;
    clonedTexture.wrapT = THREE.RepeatWrapping;
    clonedTexture.repeat.set(2.8, 1);
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.anisotropy = 4;
    clonedTexture.needsUpdate = true;
    return clonedTexture;
  }, [sourceTexture]);
  const cableCurve = useMemo(() => createSerpentineCurve(), []);
  const cableGeometry = useMemo(() => new THREE.TubeGeometry(cableCurve, 220, 0.085, 10, false), [cableCurve]);
  const glowGeometry = useMemo(() => new THREE.TubeGeometry(cableCurve, 220, 0.15, 8, false), [cableCurve]);
  const neutralColor = useMemo(() => new THREE.Color("#5b5c59"), []);
  const hotColor = useMemo(() => new THREE.Color("#ff4b22"), []);
  const liveColor = useMemo(() => new THREE.Color(), []);
  const heatLevel = THREE.MathUtils.clamp((temperature - 18) / 14, 0, 1);

  useEffect(() => {
    return () => {
      cableGeometry.dispose();
      glowGeometry.dispose();
      texture.dispose();
    };
  }, [cableGeometry, glowGeometry, texture]);

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();
    liveColor.lerpColors(neutralColor, hotColor, heatLevel);

    if (cableMaterial.current) {
      cableMaterial.current.color.lerp(liveColor, 0.09);
      cableMaterial.current.emissive.lerp(liveColor, 0.09);
      cableMaterial.current.emissiveIntensity = THREE.MathUtils.lerp(0.06, 2.8, heatLevel);
    }
    if (glowMaterial.current) {
      glowMaterial.current.color.lerp(liveColor, 0.08);
      glowMaterial.current.opacity = THREE.MathUtils.lerp(0.015, 0.2, heatLevel);
    }
    if (heatLight.current) {
      heatLight.current.intensity = THREE.MathUtils.lerp(0, 34, heatLevel);
      heatLight.current.color.lerp(liveColor, 0.08);
    }
    if (group.current) {
      const targetY = reducedMotion ? 0.07 : pointer.x * 0.08;
      const targetX = reducedMotion ? -0.04 : -0.04 - pointer.y * 0.045;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.04);
      group.current.position.y = reducedMotion ? 0 : Math.sin(time * 0.45) * 0.045;
    }
  });

  const planks = useMemo(() => Array.from({ length: 15 }, (_, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    return {
      x: -4.25 + column * 4.25 + (row % 2 === 0 ? 0 : 0.52),
      z: -1.92 + row * 0.96,
    };
  }), []);

  return (
    <group ref={group} scale={mobile ? 0.73 : 0.94} position={[mobile ? 0.25 : 0.6, 0, 0]}>
      <RoundedBox args={[12.9, 0.58, 5.7]} radius={0.16} smoothness={3} position={[0, -1.28, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#9b9388" roughness={0.93} metalness={0.01} />
      </RoundedBox>
      <RoundedBox args={[12.45, 0.16, 5.22]} radius={0.06} smoothness={2} position={[0, -0.8, 0]} receiveShadow>
        <meshStandardMaterial color="#d4cec3" roughness={0.82} />
      </RoundedBox>

      <group position={[0, -0.33, 0]}>
        <mesh geometry={glowGeometry}>
          <meshBasicMaterial ref={glowMaterial} color="#625e59" transparent opacity={0.015} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh geometry={cableGeometry} castShadow>
          <meshStandardMaterial ref={cableMaterial} color="#5b5c59" emissive="#302d29" emissiveIntensity={0.06} roughness={0.32} metalness={0.28} />
        </mesh>
      </group>

      <pointLight ref={heatLight} position={[0, 0.45, 0]} color="#ff6b32" intensity={0} distance={10} decay={2.1} />

      <group position={[0, 0.9, 0]}>
        {planks.map((plank, index) => (
          <RoundedBox
            key={index}
            args={[3.92, 0.19, 0.84]}
            radius={0.035}
            smoothness={2}
            position={[plank.x, 0, plank.z]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial map={texture} color={index % 3 === 0 ? "#f4d8be" : "#ffffff"} roughness={0.52} metalness={0.02} />
          </RoundedBox>
        ))}
      </group>

      <ContactShadows position={[0, -1.58, 0]} opacity={0.45} scale={18} blur={2.6} far={5} />
    </group>
  );
}

export function HeatedFloorCanvas({ temperature, reducedMotion }: { temperature: number; reducedMotion: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.35]}
      camera={{ position: [10.8, 7.4, 12.5], fov: 34, near: 0.1, far: 70 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#ffe9cf", "#171513", 1.45]} />
      <directionalLight position={[5, 11, 8]} intensity={3.7} color="#fff0dc" castShadow shadow-mapSize-width={768} shadow-mapSize-height={768} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0002} />
      <spotLight position={[-8, 7, 4]} angle={0.42} penumbra={0.9} intensity={19} distance={28} color="#bd6c3f" />
      <HeatedFloorModel temperature={temperature} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
