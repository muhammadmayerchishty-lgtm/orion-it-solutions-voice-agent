import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceTier, type DeviceTier } from '../lib/deviceTier';
import { setHeroCanvasVisible, useActiveCanvasSlot } from '../lib/webglCoordinator';

const MAX_ROTATION_RAD = THREE.MathUtils.degToRad(12); // Strict max 12 degrees

const floorReflectionVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const floorReflectionFragment = `
  varying vec2 vUv;
  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;
    if (dist > 1.0) discard;
    float falloff = pow(max(0.0, 1.0 - dist), 2.6);
    vec3 col = mix(vec3(0.184, 0.420, 1.0), vec3(0.482, 0.302, 1.0), smoothstep(-0.4, 0.4, centered.x));
    gl_FragColor = vec4(col, falloff * 0.22);
  }
`;

function OrionMonument({
  reducedMotion,
  tier,
}: {
  reducedMotion: boolean;
  tier: DeviceTier;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const floatGroupRef = useRef<THREE.Group>(null);
  const goldStarRef = useRef<THREE.Mesh>(null);
  const blueStar1Ref = useRef<THREE.Mesh>(null);
  const blueStar2Ref = useRef<THREE.Mesh>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const isHighTier = tier === 'high';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion || tier === 'low') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      mouseTarget.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, tier]);

  // Open Torus geometry with vertex colors for the Blue (#2F6BFF) to Violet (#7B4DFF) gradient tint
  const {
    torusGeo,
    chromeInnerGeo,
    chromeOuterGeo,
    startCapPos,
    endCapPos,
    arcStartAngle,
  } = useMemo(() => {
    const radius = 1.62;
    const tube = 0.19;
    const radialSegments = isHighTier ? 48 : 28;
    const tubularSegments = isHighTier ? 180 : 108;
    const arc = Math.PI * 1.75;
    const startAngle = THREE.MathUtils.degToRad(52);

    const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);

    const posAttr = geo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);
    const colorBlue = new THREE.Color('#2F6BFF');
    const colorCyanEdge = new THREE.Color('#4E8DFF');
    const colorViolet = new THREE.Color('#7B4DFF');
    const tempColor = new THREE.Color();

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const t = THREE.MathUtils.clamp((x - y + radius * 1.4) / (radius * 2.8), 0, 1);
      if (t < 0.45) {
        tempColor.lerpColors(colorCyanEdge, colorBlue, t / 0.45);
      } else {
        tempColor.lerpColors(colorBlue, colorViolet, (t - 0.45) / 0.55);
      }
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const innerEdge = new THREE.TorusGeometry(
      radius - tube * 0.88,
      0.016,
      12,
      isHighTier ? 160 : 96,
      arc
    );
    const outerEdge = new THREE.TorusGeometry(
      radius + tube * 0.88,
      0.014,
      12,
      isHighTier ? 160 : 96,
      arc
    );

    const sPos: [number, number, number] = [radius, 0, 0];
    const ePos: [number, number, number] = [
      Math.cos(arc) * radius,
      Math.sin(arc) * radius,
      0,
    ];

    return {
      torusGeo: geo,
      chromeInnerGeo: innerEdge,
      chromeOuterGeo: outerEdge,
      startCapPos: sPos,
      endCapPos: ePos,
      arcStartAngle: startAngle,
    };
  }, [isHighTier]);

  // Explicitly dispose custom geometries on unmount
  useEffect(() => {
    return () => {
      torusGeo.dispose();
      chromeInnerGeo.dispose();
      chromeOuterGeo.dispose();
    };
  }, [torusGeo, chromeInnerGeo, chromeOuterGeo]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (!reducedMotion && floatGroupRef.current) {
      floatGroupRef.current.position.y = Math.sin(t * 1.15) * 0.11;
      floatGroupRef.current.rotation.z = Math.sin(t * 0.65) * 0.025;
    }

    if (rootGroupRef.current) {
      const targetRotY =
        reducedMotion || tier === 'low'
          ? 0
          : THREE.MathUtils.clamp(
              mouseTarget.current.x * MAX_ROTATION_RAD,
              -MAX_ROTATION_RAD,
              MAX_ROTATION_RAD
            );
      const targetRotX =
        reducedMotion || tier === 'low'
          ? 0
          : THREE.MathUtils.clamp(
              -mouseTarget.current.y * MAX_ROTATION_RAD,
              -MAX_ROTATION_RAD,
              MAX_ROTATION_RAD
            );

      const lerpFactor = Math.min(1, delta * 4.5);
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        lerpFactor
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        lerpFactor
      );
    }

    if (!reducedMotion) {
      const pulseGold = 1 + Math.sin(t * 2.1) * 0.04;
      const pulseBlue1 = 1 + Math.sin(t * 1.8 + 1.2) * 0.035;
      const pulseBlue2 = 1 + Math.sin(t * 1.8 + 2.6) * 0.035;

      if (goldStarRef.current) goldStarRef.current.scale.setScalar(pulseGold);
      if (blueStar1Ref.current) blueStar1Ref.current.scale.setScalar(pulseBlue1);
      if (blueStar2Ref.current) blueStar2Ref.current.scale.setScalar(pulseBlue2);
    }
  });

  const beltSphereRadius = 0.23;
  const beltOffset = 0.72;
  const sphereSegments = isHighTier ? 48 : 24;
  const capSegments = isHighTier ? 32 : 20;

  return (
    <group position={[0, 0, 0]}>
      <group ref={rootGroupRef}>
        <group ref={floatGroupRef}>
          <group rotation={[0, 0, arcStartAngle]}>
            <mesh geometry={torusGeo}>
              {isHighTier ? (
                <meshPhysicalMaterial
                  vertexColors
                  transparent
                  opacity={0.92}
                  transmission={0.35}
                  roughness={0.12}
                  metalness={0.22}
                  ior={1.52}
                  iridescence={0.88}
                  iridescenceIOR={1.36}
                  iridescenceThicknessRange={[160, 520]}
                  clearcoat={1}
                  clearcoatRoughness={0.08}
                  emissive="#1E40AF"
                  emissiveIntensity={0.28}
                />
              ) : (
                <meshStandardMaterial
                  vertexColors
                  transparent
                  opacity={0.85}
                  metalness={0.6}
                  roughness={0.25}
                  emissive="#1E40AF"
                  emissiveIntensity={0.32}
                />
              )}
            </mesh>

            <mesh position={startCapPos}>
              <sphereGeometry args={[0.19, capSegments, capSegments]} />
              {isHighTier ? (
                <meshPhysicalMaterial
                  color="#3E82FF"
                  transparent
                  opacity={0.92}
                  transmission={0.35}
                  roughness={0.12}
                  metalness={0.22}
                  ior={1.52}
                  iridescence={0.85}
                  clearcoat={1}
                  emissive="#2F6BFF"
                  emissiveIntensity={0.25}
                />
              ) : (
                <meshStandardMaterial
                  color="#3E82FF"
                  transparent
                  opacity={0.85}
                  metalness={0.6}
                  roughness={0.25}
                  emissive="#2F6BFF"
                  emissiveIntensity={0.28}
                />
              )}
            </mesh>

            <mesh position={endCapPos}>
              <sphereGeometry args={[0.19, capSegments, capSegments]} />
              {isHighTier ? (
                <meshPhysicalMaterial
                  color="#7B4DFF"
                  transparent
                  opacity={0.92}
                  transmission={0.35}
                  roughness={0.12}
                  metalness={0.22}
                  ior={1.52}
                  iridescence={0.85}
                  clearcoat={1}
                  emissive="#7B4DFF"
                  emissiveIntensity={0.25}
                />
              ) : (
                <meshStandardMaterial
                  color="#7B4DFF"
                  transparent
                  opacity={0.85}
                  metalness={0.6}
                  roughness={0.25}
                  emissive="#7B4DFF"
                  emissiveIntensity={0.28}
                />
              )}
            </mesh>

            <mesh geometry={chromeInnerGeo}>
              <meshStandardMaterial
                color="#E4EEFF"
                metalness={0.85}
                roughness={0.15}
                emissive="#4E8DFF"
                emissiveIntensity={0.35}
              />
            </mesh>

            <mesh geometry={chromeOuterGeo}>
              <meshStandardMaterial
                color="#B8CEFF"
                metalness={0.85}
                roughness={0.18}
                emissive="#7B4DFF"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>

          {/* Faint Diagonal Constellation Line connecting the 3 Orion-Belt Spheres */}
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.012, 0.012, beltOffset * 2.82, 16]} />
            <meshBasicMaterial color="#7DA8FF" transparent opacity={0.45} />
          </mesh>

          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.032, 0.032, beltOffset * 2.82, 16]} />
            <meshBasicMaterial color="#2F6BFF" transparent opacity={0.14} />
          </mesh>

          {/* 1. Bottom-Left Electric Blue Crystal Sphere */}
          <group position={[-beltOffset, -beltOffset, 0]}>
            <mesh ref={blueStar1Ref}>
              <sphereGeometry args={[beltSphereRadius, sphereSegments, sphereSegments]} />
              {isHighTier ? (
                <meshPhysicalMaterial
                  color="#2F6BFF"
                  emissive="#2F6BFF"
                  emissiveIntensity={1.25}
                  roughness={0.08}
                  metalness={0.15}
                  clearcoat={1}
                />
              ) : (
                <meshStandardMaterial
                  color="#2F6BFF"
                  emissive="#2F6BFF"
                  emissiveIntensity={1.15}
                  metalness={0.6}
                  roughness={0.25}
                />
              )}
            </mesh>
            <mesh>
              <sphereGeometry args={[beltSphereRadius * 1.42, 20, 20]} />
              <meshBasicMaterial
                color="#2F6BFF"
                transparent
                opacity={0.18}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight color="#2F6BFF" intensity={2.2} distance={4.0} decay={2} />
          </group>

          {/* 2. Center Champagne Gold (#F2B84B) Crystal Sphere */}
          <group position={[0, 0, 0]}>
            <mesh ref={goldStarRef}>
              <sphereGeometry args={[beltSphereRadius, sphereSegments, sphereSegments]} />
              {isHighTier ? (
                <meshPhysicalMaterial
                  color="#F2B84B"
                  emissive="#F2B84B"
                  emissiveIntensity={1.45}
                  roughness={0.08}
                  metalness={0.2}
                  clearcoat={1}
                />
              ) : (
                <meshStandardMaterial
                  color="#F2B84B"
                  emissive="#F2B84B"
                  emissiveIntensity={1.3}
                  metalness={0.6}
                  roughness={0.25}
                />
              )}
            </mesh>
            <mesh>
              <sphereGeometry args={[beltSphereRadius * 1.48, 20, 20]} />
              <meshBasicMaterial
                color="#F2B84B"
                transparent
                opacity={0.22}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight color="#F2B84B" intensity={2.8} distance={4.5} decay={2} />
          </group>

          {/* 3. Top-Right Electric Blue Crystal Sphere */}
          <group position={[beltOffset, beltOffset, 0]}>
            <mesh ref={blueStar2Ref}>
              <sphereGeometry args={[beltSphereRadius, sphereSegments, sphereSegments]} />
              {isHighTier ? (
                <meshPhysicalMaterial
                  color="#2F6BFF"
                  emissive="#2F6BFF"
                  emissiveIntensity={1.25}
                  roughness={0.08}
                  metalness={0.15}
                  clearcoat={1}
                />
              ) : (
                <meshStandardMaterial
                  color="#2F6BFF"
                  emissive="#2F6BFF"
                  emissiveIntensity={1.15}
                  metalness={0.6}
                  roughness={0.25}
                />
              )}
            </mesh>
            <mesh>
              <sphereGeometry args={[beltSphereRadius * 1.42, 20, 20]} />
              <meshBasicMaterial
                color="#2F6BFF"
                transparent
                opacity={0.18}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight color="#2F6BFF" intensity={2.2} distance={4.0} decay={2} />
          </group>

          {/* Two Tiny Distant Stars Outside the Ring */}
          <mesh position={[-1.85, 1.58, -0.55]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color="#F2B84B" />
          </mesh>

          <mesh position={[1.78, -1.48, -0.45]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#8DAEFF" />
          </mesh>
        </group>
      </group>

      {/* Soft Radial Floor Reflection Below (Blends Seamlessly With Page Background) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.32, 0]}>
        <planeGeometry args={[4.8, 2.2]} />
        <shaderMaterial
          vertexShader={floorReflectionVertex}
          fragmentShader={floorReflectionFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function HeroOrionScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const activeSlot = useActiveCanvasSlot();
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl2') ||
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglAvailable(false);
        setHeroCanvasVisible(false);
      }
    } catch {
      setWebglAvailable(false);
      setHeroCanvasVisible(false);
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    const onVisibility = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Pause 3D canvas when scrolled offscreen and hand over rendering slot to Starfield
    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          const visible = entry?.isIntersecting ?? true;
          setIsInViewport(visible);
          setHeroCanvasVisible(visible);
        },
        { rootMargin: '80px' }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
      setHeroCanvasVisible(false);
    };
  }, []);

  // Show static logo if WebGL is unavailable or prefers-reduced-motion is enabled
  if (!webglAvailable || reducedMotion) {
    return (
      <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[560px] flex items-center justify-center overflow-visible bg-transparent">
        <img
          src="/images/orion-logo.svg"
          alt="ORION IT SOLUTIONS 3D Emblem"
          width={320}
          height={320}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-60 h-60 sm:w-80 sm:h-80 object-contain drop-shadow-[0_0_45px_rgba(47,107,255,0.45)]"
        />
      </div>
    );
  }

  const canvasDpr =
    tier === 'high' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
  const shouldRender = isInViewport && tabVisible && activeSlot === 'hero';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[560px] flex items-center justify-center select-none overflow-visible bg-transparent"
      style={{ overflow: 'visible', background: 'transparent' }}
      data-cursor-hover="true"
    >
      <div
        className="absolute inset-4 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(47, 107, 255, 0.20) 0%, rgba(123, 77, 255, 0.12) 42%, transparent 70%)',
          filter: tier === 'low' ? 'blur(20px)' : 'blur(36px)',
        }}
        aria-hidden="true"
      />

      <Canvas
        frameloop={shouldRender ? 'always' : 'never'}
        dpr={canvasDpr}
        camera={{ position: [0, 0, 7.6], fov: 36, near: 0.1, far: 50 }}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          background: 'transparent',
        }}
        gl={{
          antialias: tier !== 'low',
          alpha: true,
          powerPreference: 'default',
        }}
        onCreated={({ gl }) => {
          gl.debug.checkShaderErrors = false;
          gl.setClearColor(0x000000, 0);
          gl.domElement.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault();
              setWebglAvailable(false);
              setHeroCanvasVisible(false);
            },
            false
          );
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} color="#F5F7FF" />
        <directionalLight position={[-5, -2, 4]} intensity={1.6} color="#2F6BFF" />
        <directionalLight position={[3, -4, -3]} intensity={1.3} color="#7B4DFF" />
        <pointLight position={[0, 3, 3]} intensity={1.5} color="#FFFFFF" distance={10} />

        <OrionMonument reducedMotion={reducedMotion} tier={tier} />
      </Canvas>
    </div>
  );
}

export { HeroOrionScene };

