import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, PhoneCall, X, ExternalLink } from 'lucide-react';
import { useVoiceAgent } from '../../hooks/useVoiceAgent';
import { aiConfig } from '../../lib/aiConfig';
import type { VoiceAgentStatus } from '../../types/ai';

interface VoiceAgentButtonProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onClosePanel: () => void;
  onCallStarted: () => void;
  entranceDelay?: number;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getStatusCopy(
  status: VoiceAgentStatus,
  isDemoMode: boolean,
  isMuted: boolean,
  error: string | null
): string {
  if (isDemoMode) {
    return 'Demo mode — add your Vapi Public Key & Assistant ID in src/lib/aiConfig.ts';
  }
  switch (status) {
    case 'idle':
      return 'Ready for your voice enquiry';
    case 'requesting-mic':
      return 'Requesting microphone permission...';
    case 'connecting':
      return 'Connecting to Hazel...';
    case 'listening':
      return isMuted ? 'Microphone muted' : 'Listening...';
    case 'speaking':
      return 'Hazel is speaking...';
    case 'ended':
      return 'Call ended. Thank you for speaking with Hazel.';
    case 'error':
      return (
        error ||
        'Microphone access was denied. Please allow it in your browser settings.'
      );
  }
}

export function VoiceAgentButton({
  isOpen,
  onToggleOpen,
  onClosePanel,
  onCallStarted,
  entranceDelay = 1.2,
}: VoiceAgentButtonProps) {
  const {
    start,
    stop,
    toggleMute,
    preload,
    status,
    isSpeaking,
    isMuted,
    volumeLevel,
    isMicDenied,
    error,
    duration,
    isDemoMode,
  } = useVoiceAgent(onCallStarted);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [faceImgError, setFaceImgError] = useState(false);
  const [panelAvatarError, setPanelAvatarError] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isCallActive = status === 'listening' || status === 'speaking';
  const isBusy = status === 'requesting-mic' || status === 'connecting';
  const statusCopy = getStatusCopy(status, isDemoMode, isMuted, error);

  const handleToggleButton = () => {
    // Lazy-load @vapi-ai/web when the user clicks the voice button
    preload();
    onToggleOpen();
  };

  const handleStartClick = async () => {
    onCallStarted();
    await start();
  };

  const handleEndClick = async () => {
    await stop();
  };

  return (
    <div className="relative flex items-center justify-end group/voice">
      {/* Compact Glass Call Panel Anchored Above Button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: reducedMotion ? 0.05 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Hazel AI Voice Receptionist"
            style={{
              backgroundColor: 'rgba(8, 12, 32, 0.94)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            className="absolute bottom-[calc(100%+18px)] right-0 w-[320px] max-w-[calc(100vw-32px)] rounded-3xl border border-[rgba(255,255,255,0.08)] p-5 shadow-[0_24px_60px_rgba(2,4,14,0.88),0_0_36px_rgba(47,107,255,0.18)] overflow-hidden z-50"
          >
            {/* Subtle Gradient Glow Inside Panel */}
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(47, 107, 255, 0.24) 0%, rgba(123, 77, 255, 0.14) 50%, transparent 72%)',
              }}
              aria-hidden="true"
            />

            {/* Header Row: Hazel Avatar + Title + Close */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Hazel Avatar: Mascot Face with Fallback to Orion Belt Stars Motif */}
                <div
                  className="relative w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-br from-[#2F6BFF] to-[#7B4DFF] shadow-[0_0_16px_rgba(47,107,255,0.35)] shrink-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-[#05060f]"
                  >
                    {!panelAvatarError ? (
                      <picture className="w-full h-full block">
                        <source srcSet="/images/hazel-mascot-face.webp" type="image/webp" />
                        <img
                          src="/images/hazel-mascot-face.png"
                          alt=""
                          width={512}
                          height={512}
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => {
                            console.warn('Failed to load Hazel mascot image:', '/images/hazel-mascot-face.png');
                            setPanelAvatarError(true);
                          }}
                          className="w-full h-full object-cover object-top select-none pointer-events-none"
                        />
                      </picture>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="overflow-visible"
                      >
                        <line
                          x1="5"
                          y1="17"
                          x2="19"
                          y2="7"
                          stroke="rgba(245,247,255,0.45)"
                          strokeWidth="1"
                        />
                        <circle cx="5.5" cy="16.5" r="2" fill="#2F6BFF" />
                        <circle cx="12" cy="12" r="2.4" fill="#F2B84B" />
                        <circle cx="18.5" cy="7.5" r="2" fill="#2F6BFF" />
                      </svg>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-[15px] text-[#F5F7FF] leading-none">
                      Hazel
                    </h3>
                    {isCallActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 font-mono-label text-[9px] text-[#22C55E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                        {formatDuration(duration)}
                      </span>
                    )}
                  </div>
                  <span className="font-mono-label text-[9.5px] text-[#8B93B7] block mt-1">
                    ORION AI RECEPTIONIST
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClosePanel}
                aria-label="Close Hazel voice panel"
                className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8B93B7] hover:text-[#F5F7FF] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Reactive Audio Waveform / Orb Visualizer */}
            <div className="relative z-10 my-4 py-4 px-3 rounded-2xl bg-[#050816]/75 border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center">
              <div className="h-9 flex items-center justify-center gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((bar) => {
                  const activeAnim =
                    !reducedMotion && (isCallActive || isBusy);
                  const barWeight = [0.45, 0.7, 0.9, 1.0, 0.9, 0.7, 0.45][bar] ?? 0.7;
                  const hasLiveVolume = isCallActive && volumeLevel > 0.02;
                  const liveBarHeight = Math.round(
                    Math.max(8, Math.min(34, 8 + volumeLevel * 28 * barWeight))
                  );

                  return (
                    <motion.span
                      key={bar}
                      className={`w-1.5 rounded-full ${
                        isCallActive
                          ? isSpeaking
                            ? 'bg-[#22C55E]'
                            : 'bg-[#2F6BFF]'
                          : status === 'error'
                          ? 'bg-[#EF4444]/70'
                          : 'bg-[#8B93B7]/45'
                      }`}
                      animate={
                        hasLiveVolume && !reducedMotion
                          ? {
                              height: liveBarHeight,
                              opacity: Math.min(1, 0.65 + volumeLevel * 0.35),
                            }
                          : activeAnim
                          ? {
                              height: isSpeaking
                                ? [10, 28, 12, 32, 10]
                                : [8, 18, 10, 14, 8],
                              opacity: [0.65, 1, 0.75, 1, 0.65],
                            }
                          : { height: 8, opacity: 0.45 }
                      }
                      transition={
                        hasLiveVolume && !reducedMotion
                          ? {
                              duration: 0.09,
                              ease: 'easeOut',
                            }
                          : activeAnim
                          ? {
                              duration: isSpeaking ? 0.75 : 1.25,
                              repeat: Infinity,
                              delay: bar * 0.09,
                              ease: 'easeInOut',
                            }
                          : { duration: 0.2 }
                      }
                    />
                  );
                })}
              </div>

              {/* Live Status Line */}
              <p
                aria-live="polite"
                className={`mt-2.5 text-center font-body text-[12.5px] leading-snug ${
                  status === 'error'
                    ? 'text-[#FCA5A5]'
                    : isCallActive
                    ? 'text-[#22C55E] font-medium'
                    : 'text-[#F5F7FF]/90'
                }`}
              >
                {statusCopy}
              </p>
            </div>

            {/* Primary / Secondary Action Controls */}
            <div className="relative z-10 flex flex-col gap-2.5">
              {isDemoMode ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 px-4 rounded-full bg-[#2F6BFF]/35 border border-[#2F6BFF]/40 text-[#F5F7FF]/75 font-mono-label text-[11px] font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>DEMO MODE • START CALL</span>
                  </button>

                  <a
                    href={aiConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[#22C55E]/15 border border-[rgba(255,255,255,0.12)] hover:border-[#22C55E]/50 text-[#F5F7FF] font-mono-label text-[11px] font-medium flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                  >
                    <span>CHAT ON WHATSAPP</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#22C55E]" aria-hidden="true" />
                  </a>
                </>
              ) : isCallActive ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-pressed={isMuted}
                    aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                    className={`flex-1 py-2.5 px-3 rounded-full border font-mono-label text-[10.5px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] ${
                      isMuted
                        ? 'bg-[#F2B84B]/15 border-[#F2B84B]/50 text-[#F2B84B]'
                        : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)] text-[#F5F7FF] hover:border-[#2F6BFF]/50'
                    }`}
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>UNMUTE</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>MUTE</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleEndClick()}
                    className="flex-1 py-2.5 px-3 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-[#F5F7FF] font-mono-label text-[10.5px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_24px_rgba(239,68,68,0.45)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                  >
                    <PhoneOff className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>END CALL</span>
                  </button>
                </div>
              ) : status === 'error' ? (
                <>
                  <button
                    type="button"
                    onClick={() => void handleStartClick()}
                    className="w-full py-2.5 px-4 rounded-full bg-[#2F6BFF] hover:bg-[#3B76FF] text-[#F5F7FF] font-mono-label text-[11px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_26px_rgba(47,107,255,0.5)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                  >
                    <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isMicDenied ? 'RETRY MICROPHONE' : 'TRY AGAIN'}</span>
                  </button>

                  <a
                    href={aiConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[#22C55E]/15 border border-[rgba(255,255,255,0.12)] hover:border-[#22C55E]/50 text-[#F5F7FF] font-mono-label text-[11px] font-medium flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                  >
                    <span>CHAT ON WHATSAPP</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#22C55E]" aria-hidden="true" />
                  </a>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => void handleStartClick()}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2F6BFF] hover:bg-[#3B76FF] disabled:opacity-50 text-[#F5F7FF] font-mono-label text-[11px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_26px_rgba(47,107,255,0.5)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                >
                  <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {status === 'requesting-mic'
                      ? 'ALLOW MIC IN BROWSER...'
                      : status === 'connecting'
                      ? 'CONNECTING...'
                      : status === 'ended'
                      ? 'CALL AGAIN'
                      : 'START CALL'}
                  </span>
                </button>
              )}
            </div>

            {/* Required Consent & Microphone Disclaimer */}
            <p className="relative z-10 mt-3 text-center font-body text-[10.5px] text-[#8B93B7] leading-relaxed">
              Calls use an AI assistant and your microphone. By starting, you agree to voice
              processing by our provider.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Speech-Bubble Hover Tooltip */}
      {!isOpen && (
        <div
          role="tooltip"
          style={{
            backgroundColor: 'rgba(8, 12, 32, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          className="relative mr-3.5 px-4 py-2 rounded-2xl border border-[rgba(255,255,255,0.12)] font-mono-label text-[10.5px] text-[#F5F7FF] whitespace-nowrap opacity-0 translate-x-2.5 group-hover/voice:opacity-100 group-hover/voice:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:flex items-center gap-2 shadow-[0_12px_32px_rgba(2,4,14,0.75),0_0_20px_rgba(47,107,255,0.22)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
          <span>Talk to Hazel, our AI receptionist</span>
          {/* Speech Bubble Pointer Arrow */}
          <span
            aria-hidden="true"
            style={{ backgroundColor: 'rgba(8, 12, 32, 0.92)' }}
            className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-t border-r border-[rgba(255,255,255,0.12)]"
          />
        </div>
      )}

      {/* 76px Desktop / 62px Mobile Mascot Voice Button */}
      <motion.button
        type="button"
        onClick={handleToggleButton}
        aria-label="Talk to Hazel, our AI receptionist"
        aria-expanded={isOpen}
        data-cursor-hover="true"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.45,
          delay: reducedMotion ? 0 : entranceDelay,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={reducedMotion ? undefined : { scale: 1.06 }}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        className="relative w-[62px] h-[62px] sm:w-[76px] sm:h-[76px] rounded-full overflow-visible cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
      >
        {/* Gentle Idle Floating Wrapper (translateY 4px, 3s ease-in-out loop, contained inside button box) */}
        <motion.div
          animate={
            reducedMotion
              ? { y: 0 }
              : { y: [0, -4, 0] }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative w-full h-full overflow-visible"
        >
          {/* 3 Tiny Twinkling CSS Star Sparkles Around Mascot (Opacity & Scale Only, Contained Inside Box) */}
          {!reducedMotion && (
            <>
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.65, 1.12, 0.65] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                className="pointer-events-none absolute top-0 left-1 z-30 text-[#F2B84B] select-none"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0L7.3 4.7L12 6L7.3 7.3L6 12L4.7 7.3L0 6L4.7 4.7L6 0Z" />
                </svg>
              </motion.span>

              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.6, 1.08, 0.6] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.85 }}
                className="pointer-events-none absolute top-1 right-0 z-30 text-[#2F6BFF] select-none"
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0L7.3 4.7L12 6L7.3 7.3L6 12L4.7 7.3L0 6L4.7 4.7L6 0Z" />
                </svg>
              </motion.span>

              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.06, 0.6] }}
                transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
                className="pointer-events-none absolute bottom-2 left-0 z-30 text-[#7B4DFF] select-none"
              >
                <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0L7.3 4.7L12 6L7.3 7.3L6 12L4.7 7.3L0 6L4.7 4.7L6 0Z" />
                </svg>
              </motion.span>
            </>
          )}

          {/* Active Call / Speaking Pulse Ring Contained Inside Button's Own Box */}
          {!reducedMotion && isCallActive && (
            <span
              className={`absolute inset-0 rounded-full border-2 pointer-events-none z-20 ${
                isSpeaking
                  ? 'border-[#22C55E]/90 animate-pulse'
                  : 'border-[#2F6BFF]/85 animate-pulse'
              }`}
              style={{ animationDuration: isSpeaking ? '1.2s' : '1.8s' }}
              aria-hidden="true"
            />
          )}

          {/* 2px Blue-to-Violet (#2F6BFF to #7B4DFF) Gradient Ring + Contained Soft Glow */}
          <div
            className={`relative w-full h-full rounded-full p-[2px] bg-gradient-to-br from-[#2F6BFF] to-[#7B4DFF] transition-shadow duration-300 overflow-hidden ${
              isCallActive
                ? isSpeaking
                  ? 'shadow-[0_0_14px_rgba(34,197,94,0.55),inset_0_0_12px_rgba(34,197,94,0.35)]'
                  : 'shadow-[0_0_14px_rgba(47,107,255,0.5),inset_0_0_12px_rgba(47,107,255,0.3)]'
                : 'shadow-[0_0_12px_rgba(47,107,255,0.32),0_0_18px_rgba(123,77,255,0.18)] group-hover/voice:shadow-[0_0_16px_rgba(47,107,255,0.55),0_0_22px_rgba(123,77,255,0.32)]'
            }`}
          >
            {/* Circle Background #05060f to Blend Seamlessly with Mascot Black Background */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#05060f]">
              {/* Playful Head-Tilt Wiggle Every ~8 Seconds (rotate -4 to 4 deg) */}
              <motion.div
                animate={
                  reducedMotion
                    ? { rotate: 0 }
                    : isSpeaking
                    ? { scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }
                    : {
                        rotate: [0, 0, -4, 4, -3, 3, 0, 0],
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : isSpeaking
                    ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
                    : {
                        duration: 8,
                        times: [0, 0.82, 0.85, 0.88, 0.91, 0.94, 0.97, 1],
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                className="relative w-full h-full overflow-hidden rounded-full"
              >
                {!faceImgError ? (
                  <picture className="w-full h-full block">
                    <source srcSet="/images/hazel-mascot-face.webp" type="image/webp" />
                    <img
                      src="/images/hazel-mascot-face.png"
                      alt="Hazel — ORION AI Voice Receptionist"
                      width={512}
                      height={512}
                      draggable={false}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        console.warn('Failed to load Hazel mascot image:', '/images/hazel-mascot-face.png');
                        setFaceImgError(true);
                      }}
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                    />
                  </picture>
                ) : (
                  /* Fallback to Current Microphone Icon Only on Real Load Failure */
                  <span className="w-full h-full rounded-full flex flex-col items-center justify-center text-[#F5F7FF] bg-[#05060f]">
                    <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5F7FF]" aria-hidden="true" />
                  </span>
                )}
              </motion.div>

              {/* Active Call Waveform Badge at Bottom Center */}
              {isCallActive && (
                <div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full bg-[#050816]/95 border border-[#22C55E]/60 shadow-[0_0_8px_rgba(34,197,94,0.45)] flex items-center gap-1"
                  aria-hidden="true"
                >
                  <span className="flex items-center gap-0.5 h-2.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-0.5 rounded-full bg-[#22C55E]"
                        animate={
                          reducedMotion
                            ? { height: 6 }
                            : { height: [3, 9, 4] }
                        }
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.14,
                        }}
                      />
                    ))}
                  </span>
                  <span className="font-mono-label text-[7px] text-[#22C55E] font-bold tracking-wider leading-none">
                    LIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pulsing Green "Online" Dot at Bottom-Right (Contained Within Button Footprint) */}
          <span
            className="absolute bottom-0.5 right-0.5 z-30 flex h-3.5 w-3.5 items-center justify-center overflow-hidden rounded-full"
            aria-hidden="true"
          >
            {!reducedMotion && (
              <span className="absolute inset-0 rounded-full bg-[#22C55E] opacity-75 animate-pulse" />
            )}
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#22C55E] border-2 border-[#05060f] shadow-[0_0_6px_#22C55E]" />
          </span>
        </motion.div>
      </motion.button>
    </div>
  );
}
export default VoiceAgentButton;
