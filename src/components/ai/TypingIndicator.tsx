import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-2.5"
      role="status"
      aria-live="polite"
      aria-label="ORION AI is typing"
    >
      <div className="px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] inline-flex items-center gap-1.5">
        {[0, 1, 2].map((dotIdx) => (
          <motion.span
            key={dotIdx}
            className="w-2 h-2 rounded-full bg-[#2F6BFF]"
            animate={{
              opacity: [0.35, 1, 0.35],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: dotIdx * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default TypingIndicator;
