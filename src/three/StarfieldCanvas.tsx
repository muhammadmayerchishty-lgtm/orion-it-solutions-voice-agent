import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { StarfieldScene } from './StarfieldScene';
import { useDeviceTier } from '../lib/deviceTier';
import { useActiveCanvasSlot } from '../lib/webglCoordinator';

export function StarfieldCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const activeSlot = useActiveCanvasSlot();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    const handleVisibility = () => {
      setTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry?.isIntersecting ?? true);
      });
      observer.observe(containerRef.current);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer?.disconnect();
    };
  }, []);

  // Star count: 0 on low (use CSS starfield instead), 500 on mid, 1200 on high
  const starCount = tier === 'low' ? 0 : tier === 'mid' ? 500 : 1200;
  const canvasDpr =
    tier === 'high' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;

  // Only ONE WebGL canvas may render at a time:
  // When HeroOrionScene is in viewport, activeSlot === 'hero', so StarfieldCanvas pauses ('never').
  const shouldRender =
    starCount > 0 &&
    !contextLost &&
    isVisible &&
    tabVisible &&
    !reducedMotion &&
    activeSlot === 'starfield';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050816]"
      aria-hidden="true"
    >
      {/* Lightweight CSS Starfield & Nebula Layer (always present behind/for low tier and while Hero 3D logo has WebGL priority) */}
      <div className="orion-css-starfield absolute inset-0 pointer-events-none" />

      {starCount > 0 && !contextLost && (
        <Canvas
          frameloop={shouldRender ? 'always' : 'never'}
          dpr={canvasDpr}
          camera={{ position: [0, 0, 38], fov: 60, near: 0.1, far: 200 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'default',
          }}
          onCreated={({ gl }) => {
            gl.debug.checkShaderErrors = false;
            const canvas = gl.domElement;
            canvas.addEventListener(
              'webglcontextlost',
              (e) => {
                e.preventDefault();
                setContextLost(true);
              },
              false
            );
            canvas.addEventListener(
              'webglcontextrestored',
              () => {
                setContextLost(false);
              },
              false
            );
          }}
        >
          <StarfieldScene
            starCount={starCount}
            tier={tier}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      )}

      {/* Subtle Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 42%, rgba(5, 8, 22, 0.55) 82%, rgba(5, 8, 22, 0.92) 100%)',
        }}
      />
    </div>
  );
}
export default StarfieldCanvas;

