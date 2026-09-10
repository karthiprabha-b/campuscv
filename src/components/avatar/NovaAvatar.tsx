"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarState } from '../../lib/avatarController';

interface NovaAvatarProps {
  state: AvatarState;
}

export default function NovaAvatar({ state: activeState }: NovaAvatarProps) {
  const characterRef = useRef<THREE.Group>(null);
  const chairRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const eyeWhiteLRef = useRef<THREE.Mesh>(null);
  const eyeWhiteRRef = useRef<THREE.Mesh>(null);
  const laptopGlowLightRef = useRef<THREE.PointLight>(null);

  // 1. Memoize Toon Materials (stops recreations on frames)
  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({
        color: 0xfccfa0,
        roughness: 0.65,
        metalness: 0.0,
      }),
      hoodie: new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        roughness: 0.8,
        metalness: 0.0,
      }),
      pants: new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.8,
        metalness: 0.0,
      }),
      shoe: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.0,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: 0x5c4033,
        roughness: 0.85,
        metalness: 0.0,
      }),
      chair: new THREE.MeshStandardMaterial({
        color: 0x242427,
        roughness: 0.7,
        metalness: 0.0,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0xe4e4e7,
        roughness: 0.15,
        metalness: 0.85,
      }),
      eye: new THREE.MeshBasicMaterial({ color: 0x18181b }),
      whiteFabric: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
      }),
      screenGlass: new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        side: THREE.DoubleSide,
      }),
    };
  }, []);

  // 2. Main Frame Hook (60 FPS updates)
  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const time = elapsed * 1.5;

    // Breathing float animation
    const breathe = Math.sin(time * 0.9) * 0.015;
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
    const yOffset = isMobileViewport ? -0.15 : 0.05;
    const chairYOffset = isMobileViewport ? -0.62 : -0.42;

    if (characterRef.current) characterRef.current.position.y = yOffset + breathe;
    if (chairRef.current) chairRef.current.position.y = chairYOffset + breathe * 0.4;

    // Blink Cycle (squash vertical scale)
    const blink = Math.floor(elapsed % 4.5) === 0 && (elapsed % 4.5) < 0.12 ? 0.08 : 1.0;
    if (eyeWhiteLRef.current) eyeWhiteLRef.current.scale.y = blink;
    if (eyeWhiteRRef.current) eyeWhiteRRef.current.scale.y = blink;

    // Dynamic Face Cursor Tracking (using R3F pointer coordinates)
    const mx = state.pointer.x * 0.28;
    const my = state.pointer.y * 0.18;

    if (headRef.current) {
      if (activeState === 'typing' || activeState === 'loading') {
        // Typing: Look down at screen
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, 0.08);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -0.22, 0.08);
      } else if (activeState === 'think') {
        // Thinking: Look up and slightly left
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, -0.15, 0.08);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0.18, 0.08);
      } else {
        // Default: Track cursor
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mx, 0.08);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, my, 0.08);
      }
    }

    // Joint State Machine animations
    if (activeState === 'typing' || activeState === 'loading') {
      // Rapid Typing movement
      const speedMult = activeState === 'loading' ? 24 : 18;
      leftArmRef.current?.rotation.set(-Math.PI / 2.5 + Math.sin(time * speedMult) * 0.08, 0.1, -Math.PI / 12);
      rightArmRef.current?.rotation.set(-Math.PI / 2.5 + Math.cos(time * speedMult) * 0.08, -0.1, Math.PI / 12);
      if (laptopGlowLightRef.current) {
        laptopGlowLightRef.current.intensity = 2.0 + Math.sin(time * speedMult) * 0.6;
      }
    } else if (activeState === 'wave') {
      // Wave right arm, rest left arm on laptop
      rightArmRef.current?.rotation.set(-Math.PI / 1.5, Math.sin(time * 8) * 0.16, -Math.PI / 8);
      leftArmRef.current?.rotation.set(-Math.PI / 2.6, 0.1, -Math.PI / 12);
      if (laptopGlowLightRef.current) laptopGlowLightRef.current.intensity = 1.0;
    } else if (activeState === 'think') {
      // Touch chin with left hand, rest right hand
      leftArmRef.current?.rotation.set(-Math.PI / 1.8, 0.2, 0.15);
      rightArmRef.current?.rotation.set(-Math.PI / 2.6, -0.1, Math.PI / 12);
      if (laptopGlowLightRef.current) laptopGlowLightRef.current.intensity = 0.5;
    } else if (activeState === 'listen' || activeState === 'talk') {
      // Lean head nod, rest hands
      const nod = Math.sin(time * 4.5) * 0.04;
      if (headRef.current && activeState === 'listen') {
        headRef.current.rotation.x += nod;
      }
      leftArmRef.current?.rotation.set(-Math.PI / 2.6, 0.1, -Math.PI / 12);
      rightArmRef.current?.rotation.set(-Math.PI / 2.6, -0.1, Math.PI / 12);
      if (laptopGlowLightRef.current) laptopGlowLightRef.current.intensity = 1.2;
    } else if (activeState === 'celebrate') {
      // Hands high in celebration
      rightArmRef.current?.rotation.set(-Math.PI / 1.4, -0.2, -Math.PI / 5);
      leftArmRef.current?.rotation.set(-Math.PI / 1.4, 0.2, Math.PI / 5);
      if (laptopGlowLightRef.current) laptopGlowLightRef.current.intensity = 1.6;
    } else {
      // Default Idle: rest hands on laptop
      leftArmRef.current?.rotation.set(-Math.PI / 2.5, 0.1, -Math.PI / 12);
      rightArmRef.current?.rotation.set(-Math.PI / 2.5, -0.1, Math.PI / 12);
      if (laptopGlowLightRef.current) {
        laptopGlowLightRef.current.intensity = 1.2 + Math.sin(elapsed) * 0.15;
      }
    }
  });

  return (
    <group>
      {/* 1. Office Chair */}
      <group ref={chairRef} position={[0, -0.42, 0]}>
        {/* Seat Cushion */}
        <mesh material={materials.chair} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.06, 32]} />
        </mesh>
        {/* Backrest Frame */}
        <mesh material={materials.chair} position={[0, 0.26, -0.25]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.52, 0.38]} />
        </mesh>
        {/* Center Stand rod */}
        <mesh material={materials.metal} position={[0, -0.17, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.28, 16]} />
        </mesh>
        {/* Base star feet */}
        <mesh material={materials.chair} position={[0, -0.31, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.03, 5]} />
        </mesh>
        {/* Left Armrest */}
        <group position={[-0.35, 0.15, 0.05]}>
          <mesh material={materials.chair}>
            <boxGeometry args={[0.24, 0.024, 0.05]} />
          </mesh>
          <mesh material={materials.metal} position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14]} />
          </mesh>
        </group>
        {/* Right Armrest */}
        <group position={[0.35, 0.15, 0.05]}>
          <mesh material={materials.chair}>
            <boxGeometry args={[0.24, 0.024, 0.05]} />
          </mesh>
          <mesh material={materials.metal} position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14]} />
          </mesh>
        </group>
      </group>

      {/* 2. Character Body & Limbs */}
      <group ref={characterRef}>
        <group position={[0, -0.28, 0]}>
          {/* Torso Capsule */}
          <mesh material={materials.hoodie} castShadow receiveShadow>
            <capsuleGeometry args={[0.17, 0.26, 8, 16]} />
          </mesh>
          {/* White T-Shirt Collar */}
          <mesh material={materials.whiteFabric} position={[0, 0.19, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.02, 16]} />
          </mesh>
          {/* CampusCV Logo emblem */}
          <mesh material={materials.whiteFabric} position={[0, 0.08, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.01, 16]} />
          </mesh>
          {/* Drawstring Left */}
          <mesh material={materials.whiteFabric} position={[-0.03, 0.1, 0.16]} rotation={[0, 0, 0.1]}>
            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
          </mesh>
          {/* Drawstring Right */}
          <mesh material={materials.whiteFabric} position={[0.03, 0.1, 0.16]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
          </mesh>
          {/* Back hood roll */}
          <mesh material={materials.hoodie} position={[0, 0.1, -0.13]} rotation={[-Math.PI / 6, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          </mesh>

          {/* Left Arm Joint hierarchy */}
          <group ref={leftArmRef} position={[-0.2, 0.12, 0]}>
            <mesh material={materials.hoodie}>
              <sphereGeometry args={[0.048, 16, 16]} />
            </mesh>
            <mesh material={materials.hoodie} position={[0, -0.09, 0]}>
              <cylinderGeometry args={[0.036, 0.03, 0.2, 16]} />
            </mesh>
            <mesh material={materials.skin} position={[0, -0.2, 0]}>
              <sphereGeometry args={[0.032, 12, 12]} />
            </mesh>
          </group>

          {/* Right Arm Joint hierarchy */}
          <group ref={rightArmRef} position={[0.2, 0.12, 0]}>
            <mesh material={materials.hoodie}>
              <sphereGeometry args={[0.048, 16, 16]} />
            </mesh>
            <mesh material={materials.hoodie} position={[0, -0.09, 0]}>
              <cylinderGeometry args={[0.036, 0.03, 0.2, 16]} />
            </mesh>
            <mesh material={materials.skin} position={[0, -0.2, 0]}>
              <sphereGeometry args={[0.032, 12, 12]} />
            </mesh>
          </group>

          {/* Left Thigh & Shin */}
          <mesh material={materials.pants} position={[-0.1, -0.16, 0.20]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.054, 0.048, 0.26, 16]} />
          </mesh>
          <mesh material={materials.pants} position={[-0.1, -0.3, 0.33]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.28, 16]} />
          </mesh>
          <mesh material={materials.shoe} position={[-0.1, -0.44, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.044, 0.08, 8, 16]} />
          </mesh>

          {/* Right Thigh & Shin */}
          <mesh material={materials.pants} position={[0.1, -0.16, 0.20]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.054, 0.048, 0.26, 16]} />
          </mesh>
          <mesh material={materials.pants} position={[0.1, -0.3, 0.33]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.28, 16]} />
          </mesh>
          <mesh material={materials.shoe} position={[0.1, -0.44, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.044, 0.08, 8, 16]} />
          </mesh>

          {/* Silver Laptop & screen glow */}
          <group position={[0, -0.06, 0.36]}>
            {/* Keyboard base — flat on Nova's lap, keyboard keys face up */}
            <mesh material={materials.metal} castShadow>
              <boxGeometry args={[0.38, 0.016, 0.26]} />
            </mesh>
            {/* Hinge at the BACK edge — screen opens toward camera (like a real laptop) */}
            <group position={[0, 0.008, -0.13]} rotation={[Math.PI / 5.5, 0, 0]}>
              {/* Lid outer shell */}
              <mesh material={materials.metal} position={[0, 0.13, 0]} castShadow>
                <boxGeometry args={[0.38, 0.26, 0.012]} />
              </mesh>
              {/* Screen content faces toward camera (+Z) */}
              <mesh material={materials.screenGlass} position={[0, 0.13, 0.007]}>
                <planeGeometry args={[0.35, 0.23]} />
              </mesh>
            </group>
            {/* Purple glow from screen illuminates Nova's body */}
            <pointLight ref={laptopGlowLightRef} color={0xd8b4fe} intensity={1.2} distance={1.2} />
          </group>
        </group>

        {/* 4.c Head, Facial details and Hair */}
        <group ref={headRef} position={[0, 0.25, 0]}>
          {/* Neck */}
          <mesh material={materials.skin} position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
          </mesh>
          {/* Sculpted Head */}
          <mesh material={materials.skin} scale={[1.0, 1.1, 0.96]} castShadow>
            <sphereGeometry args={[0.185, 32, 32]} />
          </mesh>
          {/* Sculpted Chin */}
          <mesh material={materials.skin} position={[0, -0.12, 0.07]} scale={[1.2, 0.6, 1.0]}>
            <sphereGeometry args={[0.058, 16, 16]} />
          </mesh>
          {/* Soft Cheeks */}
          <mesh material={materials.skin} position={[-0.085, -0.05, 0.06]} scale={[1.0, 1.0, 0.7]}>
            <sphereGeometry args={[0.062, 16, 16]} />
          </mesh>
          <mesh material={materials.skin} position={[0.085, -0.05, 0.06]} scale={[1.0, 1.0, 0.7]}>
            <sphereGeometry args={[0.062, 16, 16]} />
          </mesh>

          {/* Pill-shaped Eyes */}
          <mesh ref={eyeWhiteLRef} material={materials.eye} position={[-0.06, 0.03, 0.17]}>
            <capsuleGeometry args={[0.014, 0.034, 4, 8]} />
          </mesh>
          <mesh ref={eyeWhiteRRef} material={materials.eye} position={[0.06, 0.03, 0.17]}>
            <capsuleGeometry args={[0.014, 0.034, 4, 8]} />
          </mesh>

          {/* Eyebrows */}
          <mesh material={materials.hair} position={[-0.06, 0.076, 0.168]} rotation={[0, 0, -0.06]}>
            <boxGeometry args={[0.046, 0.01, 0.01]} />
          </mesh>
          <mesh material={materials.hair} position={[0.06, 0.076, 0.168]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[0.046, 0.01, 0.01]} />
          </mesh>

          {/* Tapered Nose */}
          <mesh material={materials.skin} position={[0, -0.01, 0.18]} rotation={[-0.08, 0, 0]}>
            <capsuleGeometry args={[0.014, 0.032, 8, 16]} />
          </mesh>

          {/* Torus Smile */}
          <mesh material={materials.eye} position={[0, -0.06, 0.184]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.024, 0.005, 8, 16, Math.PI]} />
          </mesh>

          {/* Sculpted helix ears */}
          <group position={[-0.18, -0.01, -0.02]} rotation={[0, -Math.PI / 6, 0]}>
            <mesh material={materials.skin}>
              <torusGeometry args={[0.032, 0.009, 8, 16]} />
            </mesh>
            <mesh material={materials.skin} position={[0.005, 0, 0]} scale={[0.4, 1.0, 1.0]}>
              <sphereGeometry args={[0.022, 12, 12]} />
            </mesh>
          </group>
          <group position={[0.18, -0.01, -0.02]} rotation={[0, Math.PI / 6, 0]}>
            <mesh material={materials.skin}>
              <torusGeometry args={[0.032, 0.009, 8, 16]} />
            </mesh>
            <mesh material={materials.skin} position={[-0.005, 0, 0]} scale={[0.4, 1.0, 1.0]}>
              <sphereGeometry args={[0.022, 12, 12]} />
            </mesh>
          </group>

          {/* Layered clay brown hair */}
          <group>
            {/* Hair base cap */}
            <mesh material={materials.hair} position={[0, 0.03, -0.02]} rotation={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.194, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
            </mesh>
            {/* Layered forehead bangs */}
            <mesh material={materials.hair} position={[0, 0.12, 0.11]} rotation={[-0.22, 0, 0]}>
              <boxGeometry args={[0.22, 0.08, 0.08]} />
            </mesh>
            <mesh material={materials.hair} position={[-0.07, 0.11, 0.11]} scale={[1.4, 0.8, 1.0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
            </mesh>
            <mesh material={materials.hair} position={[0.07, 0.11, 0.11]} scale={[1.4, 0.8, 1.0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
            </mesh>
            {/* Sideburns */}
            <mesh material={materials.hair} position={[-0.18, -0.04, 0.02]}>
              <boxGeometry args={[0.03, 0.09, 0.04]} />
            </mesh>
            <mesh material={materials.hair} position={[0.18, -0.04, 0.02]}>
              <boxGeometry args={[0.03, 0.09, 0.04]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
