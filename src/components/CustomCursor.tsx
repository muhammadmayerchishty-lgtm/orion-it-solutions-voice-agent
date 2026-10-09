import { useEffect, useRef, useState } from 'react';
import { useDeviceTier } from '../lib/deviceTier';

/**
 * Custom Cursor:
 * Small dot + soft ring that trails with smooth damping and scales over links/buttons.
 * Automatically disabled on touch devices, low-tier devices, or when prefers-reduced-motion is enabled.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || isReducedMotion || tier === 'low') {
      setEnabled(false);
      document.body.classList.remove('custom-cursor-ready');
      return;
    }

    setEnabled(true);
    document.body.classList.add('custom-cursor-ready');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let isHoveredCurrent = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover="true"]')
        );
        if (isInteractive !== isHoveredCurrent) {
          isHoveredCurrent = isInteractive;
          setHovered(isInteractive);
        }
      }
    };

    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);

    const animateRing = () => {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.body.classList.remove('custom-cursor-ready');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [tier]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
      {/* Outer Soft Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-5 -mt-5 w-10 h-10 rounded-full flex items-center justify-center will-change-transform"
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-200 ${
            hovered
              ? 'scale-[1.65] border-[#2F6BFF]/80 bg-[#2F6BFF]/12 shadow-[0_0_24px_rgba(47,107,255,0.45)]'
              : pressed
              ? 'scale-90 border-[#7B4DFF]/70 bg-[#7B4DFF]/15'
              : 'scale-100 border-[#F5F7FF]/25 bg-[#2F6BFF]/5'
          }`}
        />
      </div>

      {/* Center Precision Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full will-change-transform"
      >
        <div
          className={`w-full h-full rounded-full transition-transform duration-150 ${
            hovered
              ? 'scale-50 bg-[#F2B84B] shadow-[0_0_10px_#F2B84B]'
              : 'scale-100 bg-[#F5F7FF] shadow-[0_0_10px_#2F6BFF]'
          }`}
        />
      </div>
    </div>
  );
}

