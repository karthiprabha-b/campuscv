"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface NovaCharacterProps {
  state: 'idle' | 'wave' | 'think' | 'listen' | 'type' | 'loading' | 'success';
}

export default function NovaCharacter({ state }: NovaCharacterProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 2.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // 2. Softened Lights (prevents washed-out/pure-white face blowout)
    const ambientLight = new THREE.AmbientLight(0xfffaf0, 0.45); // light peach warm ambient
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 0.8); // soft yellow key light
    keyLight.position.set(1.5, 3.5, 2.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe9d5ff, 0.3); // soft violet fill
    fillLight.position.set(-1.5, 1, 1.5);
    scene.add(fillLight);

    // Laptop screen glow casting upwards (softened to prevent blowout)
    const laptopGlowLight = new THREE.PointLight(0xd8b4fe, 1.2, 1.2);
    laptopGlowLight.position.set(0, 0.04, 0.22);
    scene.add(laptopGlowLight);

    // 3. Premium Matte Standard Materials (Clay / Toy style)
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xfccfa0, // Natural peach cartoon skin tone
      roughness: 0.65,
      metalness: 0.0,
    });

    const hoodieMaterial = new THREE.MeshStandardMaterial({
      color: 0x7c3aed, // Purple hoodie color
      roughness: 0.8,
      metalness: 0.0,
    });

    const pantsMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Bright blue trousers
      roughness: 0.8,
      metalness: 0.0,
    });

    const shoeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White sneakers
      roughness: 0.4,
      metalness: 0.0,
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c4033, // Rich warm brown clay hair
      roughness: 0.85,
      metalness: 0.0,
    });

    const chairMaterial = new THREE.MeshStandardMaterial({
      color: 0x242427, // Dark grey office chair mesh
      roughness: 0.7,
      metalness: 0.0,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7, // Shiny chrome laptop / support stand
      roughness: 0.15,
      metalness: 0.85,
    });

    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x18181b }); // Black eyes
    const whiteFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
    });

    // 4. CHARACTER HIERARCHY
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // 4.a Ergonomic Office Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, -0.42, 0);
    scene.add(chairGroup);

    // Rounded Seat Cushion
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 32), chairMaterial);
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    // Detailed Mesh Backrest
    const backFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 0.38), chairMaterial);
    backFrame.position.set(0, 0.26, -0.25);
    backFrame.rotation.x = 0.08;
    chairGroup.add(backFrame);

    // Seat support Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 16), metalMaterial);
    stand.position.y = -0.17;
    chairGroup.add(stand);

    // Star Base legs
    const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.03, 5), chairMaterial);
    baseDisc.position.y = -0.31;
    chairGroup.add(baseDisc);

    // Armrests
    const armrestL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.024, 0.05), chairMaterial);
    armrestL.position.set(-0.35, 0.15, 0.05);
    chairGroup.add(armrestL);

    const armSupportL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14), metalMaterial);
    armSupportL.position.set(-0.35, 0.08, 0.05);
    chairGroup.add(armSupportL);

    const armrestR = armrestL.clone();
    armrestR.position.x = 0.35;
    chairGroup.add(armrestR);

    const armSupportR = armSupportL.clone();
    armSupportR.position.x = 0.35;
    chairGroup.add(armSupportR);

    // 4.b Torso (Humanoid Capsule)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.28, 0);
    characterGroup.add(torsoGroup);

    // Torso Capsule (rounded shoulders)
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.26, 8, 16), hoodieMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    torsoGroup.add(body);

    // White T-shirt collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.02, 16), whiteFabricMaterial);
    collar.position.y = 0.19;
    torsoGroup.add(collar);

    // CampusCV Logo emblem on chest
    const logoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.01, 16), whiteFabricMaterial);
    logoMesh.position.set(0, 0.08, 0.16);
    logoMesh.rotation.x = Math.PI / 2;
    torsoGroup.add(logoMesh);

    // Drawstrings (White tubes)
    const stringL = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.1, 8), whiteFabricMaterial);
    stringL.position.set(-0.03, 0.1, 0.16);
    stringL.rotation.z = 0.1;
    torsoGroup.add(stringL);

    const stringR = stringL.clone();
    stringR.position.x = 0.03;
    stringR.rotation.z = -0.1;
    torsoGroup.add(stringR);

    // Hoodie Hood
    const hoodieBack = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.6), hoodieMaterial);
    hoodieBack.position.set(0, 0.1, -0.13);
    hoodieBack.rotation.x = -Math.PI / 6;
    torsoGroup.add(hoodieBack);

    // 4.c Head (Humanoid Sculpted Jaw/Cheeks)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.25, 0);
    characterGroup.add(headGroup);

    // Neck (matching skin tone)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), skinMaterial);
    neck.position.y = -0.14;
    headGroup.add(neck);

    // Main Head Sphere (slightly squashed vertically for a cartoon chin shape)
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.185, 32, 32), skinMaterial);
    face.scale.set(1.0, 1.1, 0.96);
    face.castShadow = true;
    headGroup.add(face);

    // Sculpted Chin volume
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), skinMaterial);
    chin.position.set(0, -0.12, 0.07);
    chin.scale.set(1.2, 0.6, 1.0);
    headGroup.add(chin);

    // Sculpted Cheeks volume
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 16), skinMaterial);
    cheekL.position.set(-0.085, -0.05, 0.06);
    cheekL.scale.set(1.0, 1.0, 0.7);
    headGroup.add(cheekL);

    const cheekR = cheekL.clone();
    cheekR.position.x = 0.085;
    headGroup.add(cheekR);

    // Large Cartoon Pill Eyes
    const eyeWhiteL = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.034, 4, 8), eyeMaterial);
    eyeWhiteL.position.set(-0.06, 0.03, 0.17);
    headGroup.add(eyeWhiteL);

    const eyeWhiteR = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.034, 4, 8), eyeMaterial);
    eyeWhiteR.position.set(0.06, 0.03, 0.17);
    headGroup.add(eyeWhiteR);

    // Eyebrows
    const eyebrowL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.01, 0.01), hairMaterial);
    eyebrowL.position.set(-0.06, 0.076, 0.168);
    eyebrowL.rotation.z = -0.06;
    headGroup.add(eyebrowL);

    const eyebrowR = eyebrowL.clone();
    eyebrowR.position.x = 0.06;
    eyebrowR.rotation.z = 0.06;
    headGroup.add(eyebrowR);

    // Tapered Cartoon Nose
    const nose = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.032, 8, 16), skinMaterial);
    nose.position.set(0, -0.01, 0.18);
    nose.rotation.x = -0.08;
    headGroup.add(nose);

    // Curved Torus Smile (exactly like the image)
    const mouthGeo = new THREE.TorusGeometry(0.032, 0.006, 8, 16, Math.PI);
    const smile = new THREE.Mesh(mouthGeo, eyeMaterial);
    smile.position.set(0, -0.07, 0.172);
    smile.rotation.x = Math.PI / 1.95; 
    smile.rotation.z = Math.PI; // curves up
    headGroup.add(smile);

    // Sculpted Humanoid Ears
    const earHelixL = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.009, 8, 16), skinMaterial);
    earHelixL.position.set(-0.18, -0.01, -0.02);
    earHelixL.rotation.y = -Math.PI / 6;
    headGroup.add(earHelixL);

    const earBackingL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), skinMaterial);
    earBackingL.position.set(-0.175, -0.01, -0.02);
    earBackingL.scale.set(0.4, 1.0, 1.0);
    headGroup.add(earBackingL);

    const earHelixR = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.009, 8, 16), skinMaterial);
    earHelixR.position.set(0.18, -0.01, -0.02);
    earHelixR.rotation.y = Math.PI / 6;
    headGroup.add(earHelixR);

    const earBackingR = earBackingL.clone();
    earBackingR.position.x = 0.175;
    headGroup.add(earBackingR);

    // Layered Cartoon Hair Cap & Sweeping Bangs
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Base cap (scaled slightly larger to sit naturally on head)
    const mainHairCap = new THREE.Mesh(new THREE.SphereGeometry(0.194, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.6), hairMaterial);
    mainHairCap.position.set(0, 0.03, -0.02);
    mainHairCap.rotation.x = -0.15;
    hairGroup.add(mainHairCap);

    // Front Fringe / Bangs blocks
    const bangCenter = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.08), hairMaterial);
    bangCenter.position.set(0, 0.12, 0.11);
    bangCenter.rotation.x = -0.22;
    hairGroup.add(bangCenter);

    const bangLeft = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), hairMaterial);
    bangLeft.position.set(-0.07, 0.11, 0.11);
    bangLeft.scale.set(1.4, 0.8, 1.0);
    hairGroup.add(bangLeft);

    const bangRight = bangLeft.clone();
    bangRight.position.x = 0.07;
    hairGroup.add(bangRight);

    // Sideburns
    const sideburnL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.04), hairMaterial);
    sideburnL.position.set(-0.18, -0.04, 0.02);
    hairGroup.add(sideburnL);

    const sideburnR = sideburnL.clone();
    sideburnR.position.x = 0.18;
    hairGroup.add(sideburnR);

    // 4.d Left Arm & Hand
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.2, 0.12, 0);
    torsoGroup.add(leftArmGroup);

    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), hoodieMaterial);
    leftArmGroup.add(shoulderL);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.2, 16), hoodieMaterial);
    armL.position.y = -0.09;
    leftArmGroup.add(armL);

    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), skinMaterial);
    handL.position.y = -0.2;
    leftArmGroup.add(handL);

    // 4.e Right Arm & Hand
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.2, 0.12, 0);
    torsoGroup.add(rightArmGroup);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), hoodieMaterial);
    rightArmGroup.add(shoulderR);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.2, 16), hoodieMaterial);
    armR.position.y = -0.09;
    rightArmGroup.add(armR);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), skinMaterial);
    handR.position.y = -0.2;
    rightArmGroup.add(handR);

    // 4.f Legs & Sneakers (Sitting Pose)
    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.048, 0.26, 16), pantsMaterial);
    thighL.position.set(-0.1, -0.16, 0.12);
    thighL.rotation.x = Math.PI / 2; // forward thighs
    torsoGroup.add(thighL);

    const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.28, 16), pantsMaterial);
    shinL.position.set(-0.1, -0.3, 0.25);
    torsoGroup.add(shinL);

    const sneakerL = new THREE.Mesh(new THREE.CapsuleGeometry(0.044, 0.08, 8, 16), shoeMaterial);
    sneakerL.position.set(-0.1, -0.44, 0.28);
    sneakerL.rotation.x = Math.PI / 2;
    torsoGroup.add(sneakerL);

    const thighR = thighL.clone();
    thighR.position.x = 0.1;
    torsoGroup.add(thighR);

    const shinR = shinL.clone();
    shinR.position.x = 0.1;
    torsoGroup.add(shinR);

    const sneakerR = sneakerL.clone();
    sneakerR.position.x = 0.1;
    torsoGroup.add(sneakerR);

    // 4.g Glowing Silver Laptop
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, -0.06, 0.22);
    torsoGroup.add(laptopGroup);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.016, 0.26), metalMaterial);
    laptopGroup.add(laptopBase);

    // Laptop lid screen opened facing slightly forward/upward toward face
    const laptopLidGroup = new THREE.Group();
    laptopLidGroup.position.set(0, 0.008, -0.13);
    laptopLidGroup.rotation.x = -Math.PI / 2.7; // Tilted slightly more forward facing camera better
    laptopGroup.add(laptopLidGroup);

    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.012, 0.26), metalMaterial);
    laptopScreen.position.y = 0.13;
    laptopLidGroup.add(laptopScreen);

    const screenGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.23), new THREE.MeshBasicMaterial({ color: 0xa78bfa, side: THREE.DoubleSide }));
    screenGlass.position.set(0, 0.13, 0.008);
    laptopLidGroup.add(screenGlass);

    // 5. Ambient Floating Particles
    const partCount = 45;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);

    for (let i = 0; i < partCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 3;
      partPos[i * 3 + 1] = (Math.random() - 0.5) * 2 + 0.1;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.018,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 6. Mouse Listener for cursor face-tracking
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animations Loop
    const startTime = performance.now();
    let tickId: number;

    const animate = () => {
      tickId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) * 0.001;
      const time = elapsed * 1.5;
      const activeState = stateRef.current;

      // Chair and Character Floating breathing wave
      const breathe = Math.sin(time * 0.9) * 0.015;
      characterGroup.position.y = 0.05 + breathe;
      chairGroup.position.y = -0.45 + breathe * 0.4;

      // Digital eyes blink cycle (squash vertical scale)
      const blink = Math.floor(elapsed % 4) === 0 && (elapsed % 4) < 0.12 ? 0.08 : 1.0;
      eyeWhiteL.scale.y = blink;
      eyeWhiteR.scale.y = blink;

      // Face tracking target interpolation
      const targetFaceX = mouse.x * 0.28;
      const targetFaceY = mouse.y * 0.18;

      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetFaceX, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetFaceY, 0.08);

      // State Machine joints animation
      if (activeState === 'type' || activeState === 'loading') {
        // Look down at screen
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -0.22, 0.08);

        // Typing hand alternates
        leftArmGroup.rotation.set(-Math.PI / 4 + Math.sin(time * 18) * 0.1, 0, -Math.PI / 10);
        rightArmGroup.rotation.set(-Math.PI / 4 + Math.cos(time * 18) * 0.1, 0, Math.PI / 10);

        // Laptop glow light pulse
        laptopGlowLight.intensity = 2.0 + Math.sin(time * 18) * 0.6;
      } 
      else if (activeState === 'wave') {
        // Wave right arm, friendly head tilt
        gsap.to(headGroup.rotation, { z: -0.06, duration: 0.5 });

        rightArmGroup.rotation.set(-Math.PI / 1.5, Math.sin(time * 8) * 0.16, -Math.PI / 8);
        leftArmGroup.rotation.set(-Math.PI / 3.5, 0.1, -Math.PI / 12);
        
        laptopGlowLight.intensity = 1.0;
      } 
      else if (activeState === 'think') {
        // Look up, touch chin
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, -0.15, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0.18, 0.08);

        leftArmGroup.rotation.set(-Math.PI / 1.8, 0.2, 0.15);
        rightArmGroup.rotation.set(-Math.PI / 3.5, -0.1, Math.PI / 12);
        laptopGlowLight.intensity = 0.5;
      } 
      else if (activeState === 'listen') {
        // Lean head, nod slightly
        const nod = Math.sin(time * 4.5) * 0.04;
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0.06 + nod, 0.08);

        leftArmGroup.rotation.set(-Math.PI / 3.5, 0.1, -Math.PI / 12);
        rightArmGroup.rotation.set(-Math.PI / 3.5, -0.1, Math.PI / 12);
        laptopGlowLight.intensity = 1.2;
      } 
      else if (activeState === 'success') {
        // Raise arm celebration, look happy
        gsap.to(headGroup.rotation, { z: -0.04, duration: 0.5 });

        rightArmGroup.rotation.set(-Math.PI / 1.4, -0.2, -Math.PI / 5);
        leftArmGroup.rotation.set(-Math.PI / 1.4, 0.2, Math.PI / 5);
        
        laptopGlowLight.intensity = 1.6;
      } 
      else {
        // Idle - hands rest on keyboard base
        gsap.to(headGroup.rotation, { z: 0, duration: 0.8 });
        leftArmGroup.rotation.set(-Math.PI / 3.2, 0.1, -Math.PI / 10);
        rightArmGroup.rotation.set(-Math.PI / 3.2, -0.1, Math.PI / 10);
        laptopGlowLight.intensity = 1.2 + Math.sin(elapsed) * 0.15;
      }

      // Rotate particle cloud
      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(tickId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative" />
  );
}
