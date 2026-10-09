import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DeviceTier } from '../lib/deviceTier';

interface StarfieldSceneProps {
  starCount: number;
  tier: DeviceTier;
  reducedMotion: boolean;
}

const starVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // Soft sinusoidal twinkle per star
    float twinkle = sin(uTime * aSpeed + aPhase) * 0.35 + 0.65;
    vAlpha = twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation based on camera distance
    gl_PointSize = aSize * uPixelRatio * (160.0 / -mvPosition.z) * (0.85 + 0.3 * twinkle);
    gl_PointSize = clamp(gl_PointSize, 1.0, 14.0);
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circular soft star sprite
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Crisp core + soft halo falloff
    float core = smoothstep(0.5, 0.05, dist);
    float glow = pow(max(0.0, 1.0 - dist * 2.0), 2.2);
    float alpha = (core * 0.65 + glow * 0.55) * vAlpha;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered);

    // Subtle organic wave modulation
    float wave = sin(centered.x * 5.0 + uTime * 0.18) * cos(centered.y * 5.0 - uTime * 0.14) * 0.08;
    float mask = smoothstep(0.5, 0.02, dist + wave);
    float falloff = pow(mask, 2.0);

    vec3 color = mix(uColorA, uColorB, smoothstep(-0.35, 0.35, centered.x + centered.y));
    gl_FragColor = vec4(color, falloff * uOpacity);
  }
`;

export function StarfieldScene({ starCount, tier, reducedMotion }: StarfieldSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nebulaGroupRef = useRef<THREE.Group>(null);
  const starGeoRef = useRef<THREE.BufferGeometry>(null);
  const starMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const nebulaMat1Ref = useRef<THREE.ShaderMaterial>(null);
  const nebulaMat2Ref = useRef<THREE.ShaderMaterial>(null);
  const nebulaMat3Ref = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    return () => {
      starGeoRef.current?.dispose();
      starMaterialRef.current?.dispose();
      nebulaMat1Ref.current?.dispose();
      nebulaMat2Ref.current?.dispose();
      nebulaMat3Ref.current?.dispose();
    };
  }, []);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion || tier === 'low') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.x = nx;
      mouseTarget.current.y = ny;
    };

    const handleScroll = () => {
      if (reducedMotion || tier === 'low') return;
      scrollTarget.current = window.scrollY || 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [reducedMotion, tier]);

  const { positions, sizes, phases, speeds, colors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const sz = new Float32Array(starCount);
    const ph = new Float32Array(starCount);
    const sp = new Float32Array(starCount);
    const col = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color('#F5F7FF'), // Pure starlight white
      new THREE.Color('#C7D9FF'), // Soft ice blue
      new THREE.Color('#2F6BFF'), // Orion primary blue
      new THREE.Color('#7B4DFF'), // Orion cosmic violet
      new THREE.Color('#F2B84B'), // Rare champagne gold star
    ];

    for (let i = 0; i < starCount; i++) {
      // Distribute stars in a deep 3D spherical shell / field
      const radius = 18 + Math.pow(Math.random(), 0.75) * 95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 110 - 15;

      // Star size with occasional brighter navigational stars
      const isBright = Math.random() > 0.92;
      sz[i] = isBright ? 2.4 + Math.random() * 1.8 : 0.8 + Math.random() * 1.4;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.6 + Math.random() * 1.8;

      // Weighted color selection (mostly crisp white/blue, occasional violet, rare gold)
      const r = Math.random();
      let chosenColor = palette[0];
      if (r > 0.965) {
        chosenColor = palette[4]; // Champagne gold (3.5% of stars)
      } else if (r > 0.84) {
        chosenColor = palette[3]; // Violet
      } else if (r > 0.64) {
        chosenColor = palette[2]; // Primary blue
      } else if (r > 0.35) {
        chosenColor = palette[1]; // Soft ice blue
      }

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return {
      positions: pos,
      sizes: sz,
      phases: ph,
      speeds: sp,
      colors: col,
    };
  }, [starCount]);

  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: tier === 'high' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1,
      },
    }),
    [tier]
  );

  const nebulaUniforms1 = useMemo(
    () => ({
      uColorA: { value: new THREE.Color('#2F6BFF') },
      uColorB: { value: new THREE.Color('#7B4DFF') },
      uTime: { value: 0 },
      uOpacity: { value: 0.11 },
    }),
    []
  );

  const nebulaUniforms2 = useMemo(
    () => ({
      uColorA: { value: new THREE.Color('#7B4DFF') },
      uColorB: { value: new THREE.Color('#2F6BFF') },
      uTime: { value: 0 },
      uOpacity: { value: 0.09 },
    }),
    []
  );

  const nebulaUniforms3 = useMemo(
    () => ({
      uColorA: { value: new THREE.Color('#1B3FA8') },
      uColorB: { value: new THREE.Color('#2F6BFF') },
      uTime: { value: 0 },
      uOpacity: { value: 0.08 },
    }),
    []
  );

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (starMaterialRef.current) {
      starMaterialRef.current.uniforms.uTime.value = reducedMotion ? 0 : elapsedTime;
    }
    if (nebulaMat1Ref.current) {
      nebulaMat1Ref.current.uniforms.uTime.value = reducedMotion ? 0 : elapsedTime;
    }
    if (nebulaMat2Ref.current) {
      nebulaMat2Ref.current.uniforms.uTime.value = reducedMotion ? 0 : elapsedTime;
    }
    if (nebulaMat3Ref.current) {
      nebulaMat3Ref.current.uniforms.uTime.value = reducedMotion ? 0 : elapsedTime;
    }

    if (reducedMotion) return;

    // Smooth damping for mouse and scroll parallax
    const lerpFactor = Math.min(1, delta * 3.5);
    mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * lerpFactor;
    mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * lerpFactor;
    scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * lerpFactor;

    const scrollProgress = scrollCurrent.current * 0.00025;

    if (groupRef.current) {
      // Base celestial drift + mouse parallax + scroll rotation
      groupRef.current.rotation.y =
        elapsedTime * 0.014 + mouseCurrent.current.x * 0.14 + scrollProgress * 0.7;
      groupRef.current.rotation.x =
        Math.sin(elapsedTime * 0.008) * 0.04 +
        -mouseCurrent.current.y * 0.1 +
        scrollProgress * 0.45;
      groupRef.current.position.y = (scrollCurrent.current * 0.004) % 18;
    }

    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.z = elapsedTime * 0.008 - scrollProgress * 0.2;
      nebulaGroupRef.current.position.x = mouseCurrent.current.x * 2.2;
      nebulaGroupRef.current.position.y = mouseCurrent.current.y * 1.6;
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#050816', 0.0075]} />

      {/* Nebula Additive Fog Planes */}
      <group ref={nebulaGroupRef}>
        <mesh position={[-18, 10, -48]} rotation={[0, 0, 0.35]}>
          <planeGeometry args={[78, 78, 1, 1]} />
          <shaderMaterial
            ref={nebulaMat1Ref}
            vertexShader={nebulaVertexShader}
            fragmentShader={nebulaFragmentShader}
            uniforms={nebulaUniforms1}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh position={[22, -12, -55]} rotation={[0, 0, -0.45]}>
          <planeGeometry args={[86, 86, 1, 1]} />
          <shaderMaterial
            ref={nebulaMat2Ref}
            vertexShader={nebulaVertexShader}
            fragmentShader={nebulaFragmentShader}
            uniforms={nebulaUniforms2}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {tier === 'high' && (
          <mesh position={[0, 2, -65]} rotation={[0, 0, 0.12]}>
            <planeGeometry args={[95, 65, 1, 1]} />
            <shaderMaterial
              ref={nebulaMat3Ref}
              vertexShader={nebulaVertexShader}
              fragmentShader={nebulaFragmentShader}
              uniforms={nebulaUniforms3}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>

      {/* Twinkling Starfield Points (500 on mid, 1200 on high) */}
      <group ref={groupRef} key={starCount}>
        <points>
          <bufferGeometry ref={starGeoRef}>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-aSize"
              args={[sizes, 1]}
            />
            <bufferAttribute
              attach="attributes-aPhase"
              args={[phases, 1]}
            />
            <bufferAttribute
              attach="attributes-aSpeed"
              args={[speeds, 1]}
            />
            <bufferAttribute
              attach="attributes-aColor"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={starMaterialRef}
            vertexShader={starVertexShader}
            fragmentShader={starFragmentShader}
            uniforms={starUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  );
}

