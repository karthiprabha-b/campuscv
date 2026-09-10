"use client";

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import NovaAvatar from './NovaAvatar';
import { AvatarState } from '../../lib/avatarController';

interface NovaSceneProps {
  state: AvatarState;
}

// Separate component for rotating the floating particles
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 45; i++) {
      temp.push(
        (Math.random() - 0.5) * 2.5,  // X
        (Math.random() - 0.5) * 1.8 + 0.1, // Y
        (Math.random() - 0.5) * 2.0   // Z
      );
    }
    return [new Float32Array(temp)];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c084fc"
        size={0.018}
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export default function NovaScene({ state }: NovaSceneProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      {/* Background Gradient matching Apple SaaS layout */}
      <div className="absolute inset-0 bg-radial-light pointer-events-none" />

      {/* R3F Canvas Container */}
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: isMobile ? [0, 0.08, 2.65] : [0, 0.05, 2.4], fov: 35 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="w-full h-full relative z-10"
      >
        <Suspense fallback={null}>
          {/* Lights */}
          <ambientLight color="#fffaf0" intensity={0.45} />
          <directionalLight
            color="#fffbeb"
            intensity={0.8}
            position={[1.5, 3.5, 2.5]}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
          <directionalLight color="#e9d5ff" intensity={0.3} position={[-1.5, 1, 1.5]} />

          {/* Avatar Mesh */}
          <NovaAvatar state={state} />

          {/* Floating purple particle dust */}
          <FloatingParticles />

          {/* Soft Ground Contact Shadows */}
          <ContactShadows
            opacity={0.6}
            scale={4}
            blur={2.4}
            far={0.8}
            resolution={256}
            position={[0, -0.62, 0]}
            color="#18181b"
          />
        </Suspense>
      </Canvas>

      {/* Tailwind Radial Light Shader effect behind character */}
      <style jsx global>{`
        .bg-radial-light {
          background: radial-gradient(circle at 45% 55%, rgba(245, 243, 255, 0.9) 0%, rgba(255, 255, 255, 1) 75%);
        }
      `}</style>
    </div>
  );
}
