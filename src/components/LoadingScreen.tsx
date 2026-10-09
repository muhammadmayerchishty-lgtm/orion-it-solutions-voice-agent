import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrionLogoDraw } from './OrionLogo';

/**
 * Short loading screen with the Orion logo ring drawing itself, then fading out.
 * Respects prefers-reduced-motion.
 */
export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 350 : 1750;

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="orion-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#050816] flex flex-col items-center justify-center select-none pointer-events-auto"
          aria-label="Loading Orion IT Solutions"
        >
          {/* Ambient glow behind the logo mark */}
          <div
            className="absolute w-72 h-72 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(47, 107, 255, 0.22) 0%, rgba(123, 77, 255, 0.1) 45%, transparent 72%)',
              filter: 'blur(24px)',
            }}
          />

          <div className="relative flex flex-col items-center">
            <OrionLogoDraw size={136} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-center"
            >
              <div className="font-display font-bold tracking-[0.28em] text-[#F5F7FF] text-[18px] md:text-[20px]">
                ORION
              </div>
              <div className="font-mono-label text-[10px] tracking-[0.28em] text-[#8B93B7] mt-1.5">
                IT SOLUTIONS
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mt-4 font-body italic text-[13px] text-[#8B93B7]/80"
            >
              Where Brands Become Stars
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
