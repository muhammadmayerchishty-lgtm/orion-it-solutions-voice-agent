import { motion } from 'framer-motion';
import { SafeImage } from './SafeImage';

interface OrionLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Displays the official /images/orion-logo.svg mark (glass ring + three Orion-belt stars)
 * alongside the "ORION" / "IT SOLUTIONS" wordmark for the navbar and footer.
 */
export function OrionLogo({
  size = 38,
  showWordmark = true,
  className = '',
}: OrionLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <SafeImage
          src="/images/orion-logo.svg"
          alt="Orion IT Solutions Logo"
          width={size}
          height={size}
          priority
          className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(47,107,255,0.45)]"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className="font-display font-bold tracking-[0.22em] text-[#F5F7FF] text-[15px] md:text-[16px]"
          >
            ORION
          </span>
          <span
            className="font-mono-label text-[9px] tracking-[0.24em] text-[#8B93B7] mt-1"
          >
            IT SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Animated SVG version of orion-logo.svg used exclusively in the initial Loading Screen
 * so the glass ring draws itself around the three Orion-belt stars.
 */
export function OrionLogoDraw({ size = 132 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="loaderRingGrad" x1="28" y1="36" x2="208" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3E82FF" />
          <stop offset="45%" stopColor="#2F6BFF" />
          <stop offset="100%" stopColor="#7B4DFF" />
        </linearGradient>
        <linearGradient id="loaderRingHighlight" x1="24" y1="24" x2="180" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8D4FF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#588BFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#9A75FF" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="loaderBeltLine" x1="78" y1="162" x2="162" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#F2B84B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="loaderGoldSphere" cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#FFF3D1" />
          <stop offset="35%" stopColor="#F6C458" />
          <stop offset="75%" stopColor="#D98B19" />
          <stop offset="100%" stopColor="#8C5105" />
        </radialGradient>
        <radialGradient id="loaderBlueSphere" cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#D9E8FF" />
          <stop offset="38%" stopColor="#4E8BFF" />
          <stop offset="78%" stopColor="#1E4FD8" />
          <stop offset="100%" stopColor="#0D2575" />
        </radialGradient>
        <radialGradient id="loaderGoldAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F2B84B" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#F2B84B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F2B84B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="loaderBlueAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#2F6BFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Diagonal Orion belt line */}
      <motion.line
        x1="80"
        y1="158"
        x2="160"
        y2="82"
        stroke="url(#loaderBeltLine)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Outer Glass Ring drawing itself */}
      <motion.path
        d="M 194.6 73.4 A 88 88 0 1 0 203.7 92.8"
        stroke="url(#loaderRingGrad)"
        strokeWidth="18"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Specular Glass Highlight */}
      <motion.path
        d="M 194.6 73.4 A 88 88 0 1 0 203.7 92.8"
        stroke="url(#loaderRingHighlight)"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 1.25, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Bottom-left Blue Star */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '80px 158px' }}
      >
        <circle cx="80" cy="158" r="24" fill="url(#loaderBlueAura)" />
        <circle cx="80" cy="158" r="10.5" fill="url(#loaderBlueSphere)" />
      </motion.g>

      {/* Center Champagne Gold Star */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '120px 120px' }}
      >
        <circle cx="120" cy="120" r="38" fill="url(#loaderGoldAura)" />
        <circle cx="120" cy="120" r="15.5" fill="url(#loaderGoldSphere)" />
      </motion.g>

      {/* Top-right Blue Star */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '160px 82px' }}
      >
        <circle cx="160" cy="82" r="24" fill="url(#loaderBlueAura)" />
        <circle cx="160" cy="82" r="10.5" fill="url(#loaderBlueSphere)" />
      </motion.g>
    </svg>
  );
}
