import { useEffect, useRef } from 'react';

/**
 * Scroll progress bar at the very top of the viewport in the blue-to-violet signature gradient.
 * Updates DOM transform directly via requestAnimationFrame without triggering React state re-renders on scroll.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const updateProgress = () => {
      rafId = null;
      if (!barRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 z-[70] h-[3px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full origin-left shadow-[0_0_16px_rgba(47,107,255,0.85)]"
        style={{
          background: 'linear-gradient(90deg, #2F6BFF 0%, #7B4DFF 100%)',
          transform: 'scaleX(0)',
          transition: 'transform 90ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}

