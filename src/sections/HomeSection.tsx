import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ChevronDown, ArrowUpRight } from 'lucide-react';

import { GlassCard } from '../components/GlassCard';
import { PillButton } from '../components/PillButton';
import { SafeImage } from '../components/SafeImage';
import { useSmoothScroll } from '../components/SmoothScrollProvider';

const HeroOrionScene = lazy(() => import('../three/HeroOrionScene'));

const ORION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const WHATSAPP_ENQUIRY_URL =
  'https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20would%20like%20to%20discuss%20a%20project';

const MARQUEE_ITEMS = [
  'WEB DESIGN',
  'UI/UX',
  'BRAND IDENTITY',
  'AI AUTOMATION',
  'AI VOICE AGENTS',
  'ARCHITECTURE & INTERIOR WEBSITES',
];

interface CounterStatProps {
  target: number;
  suffix: string;
  label: string;
}

function AnimatedCounter({ target, suffix, label }: CounterStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    const duration = 1800;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target]);

  return (
    <div ref={ref} className="flex flex-col">
      <div className="font-display font-extrabold text-[26px] sm:text-[32px] md:text-[36px] text-[#F5F7FF] tracking-tight tabular-nums leading-none">
        {count}
        <span className="text-signature-gradient">{suffix}</span>
      </div>
      <span className="font-mono-label text-[10px] sm:text-[11px] text-[#8B93B7] mt-2">
        {label}
      </span>
    </div>
  );
}

function StaggeredHeadlineLine({
  text,
  baseDelay = 0.1,
  isGradientItalic = false,
}: {
  text: string;
  baseDelay?: number;
  isGradientItalic?: boolean;
}) {
  const words = text.split(' ');
  const totalChars = text.length;
  let globalIdx = 0;

  return (
    <span
      className={`block py-0.5 sm:whitespace-nowrap ${
        isGradientItalic ? 'italic font-bold pr-3' : 'font-extrabold text-[#F5F7FF]'
      }`}
      style={{
        wordBreak: 'normal',
        overflowWrap: 'normal',
        hyphens: 'none',
      }}
      aria-label={text}
    >
      <span className="inline" aria-hidden="true">
        {words.map((word, wordIdx) => {
          const wordChars = Array.from(word);
          const wordStartIdx = globalIdx;
          globalIdx += wordChars.length + 1;

          return (
            <React.Fragment key={`${word}-${wordIdx}`}>
              <span
                className="inline-block overflow-hidden whitespace-nowrap align-bottom py-0.5"
                style={{
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  hyphens: 'none',
                }}
              >
                {wordChars.map((char, charIdx) => {
                  const idx = wordStartIdx + charIdx;
                  const ratio = totalChars > 1 ? idx / (totalChars - 1) : 0;
                  const r = Math.round(47 + (123 - 47) * ratio);
                  const g = Math.round(107 + (77 - 107) * ratio);
                  const b = 255;

                  return (
                    <motion.span
                      key={`${char}-${idx}`}
                      initial={{ y: '115%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 0.68,
                        delay: baseDelay + idx * 0.028,
                        ease: ORION_EASE,
                      }}
                      className="inline-block"
                      style={
                        isGradientItalic
                          ? {
                              color: `rgb(${r}, ${g}, ${b})`,
                            }
                          : undefined
                      }
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
              {wordIdx < words.length - 1 && (
                <span className="max-sm:block sm:inline">{' '}</span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    </span>
  );
}

export function HomeSection() {
  const { scrollTo } = useSmoothScroll();
  const burstTimeoutRef = useRef<number | null>(null);
  const [burstActive, setBurstActive] = useState(false);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) {
        window.clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLElement>, target: string) => {
    e.preventDefault();
    scrollTo(target, -20);
  };

  const handleOrionAiBurst = () => {
    setBurstActive(true);
    if (burstTimeoutRef.current) {
      window.clearTimeout(burstTimeoutRef.current);
    }
    burstTimeoutRef.current = window.setTimeout(() => {
      setBurstActive(false);
      const anchor = document.createElement('a');
      anchor.href = WHATSAPP_ENQUIRY_URL;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }, 900);
  };

  return (
    <section
      id="home"
      className="relative z-10 min-h-screen flex flex-col justify-between pt-[124px] md:pt-[144px] pb-0 overflow-hidden"
    >
      {/* Main Hero Container (1280px max width, 12-column grid) */}
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN (7 Columns on Desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Availability Glass Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: ORION_EASE }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] mb-7"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#F2B84B] shrink-0" aria-hidden="true" />
              <span className="font-mono-label text-[10px] sm:text-[11px] text-[#F5F7FF]/90 tracking-[0.12em]">
                AVAILABLE FOR FREELANCE &amp; REMOTE PROJECTS
              </span>
            </motion.div>

            {/* Giant Headline with Masked Slide-Up Letter Stagger */}
            <h1
              className="font-display uppercase tracking-[-0.025em] leading-[1.02] whitespace-normal"
              style={{
                fontSize: 'clamp(2.2rem, 5.2vw, 5rem)',
                lineHeight: 1.02,
                wordBreak: 'normal',
                overflowWrap: 'normal',
                hyphens: 'none',
              }}
            >
              <StaggeredHeadlineLine text="WHERE BRANDS" baseDelay={0.12} />
              <StaggeredHeadlineLine
                text="BECOME STARS."
                baseDelay={0.34}
                isGradientItalic
              />
            </h1>

            {/* Muted Sub-copy (18-20px) */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.62, ease: ORION_EASE }}
              className="mt-6 font-body text-[18px] md:text-[20px] leading-[1.6] text-[#8B93B7] max-w-2xl"
            >
              ORION IT SOLUTIONS crafts premium websites, brand identities and AI-powered
              enquiry experiences, especially for architecture and interior design firms.
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.74, ease: ORION_EASE }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <PillButton
                variant="primary"
                size="lg"
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
              >
                EXPLORE WORK
              </PillButton>
              <PillButton
                variant="secondary"
                size="lg"
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
              >
                LET&apos;S CONNECT
              </PillButton>
            </motion.div>

            {/* Talk to ORION AI — ThreeUI GlassAiButton framed in a GlassCard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.86, ease: ORION_EASE }}
              className="mt-8 w-full max-w-[540px]"
            >
              <GlassCard className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 mb-3 px-1">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]"
                      aria-hidden="true"
                    />
                    <span className="font-mono-label text-[10px] sm:text-[11px] text-[#8B93B7]">
                      AI-POWERED ENQUIRY EXPERIENCE
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOrionAiBurst}
                    data-cursor-hover="true"
                    className="min-h-[44px] px-2 inline-flex items-center gap-1.5 font-mono-label text-[10px] sm:text-[11px] text-[#F5F7FF] hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  >
                    <span>{burstActive ? 'LAUNCHING ENQUIRY...' : 'TALK TO ORION AI'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive ORION AI Glass Surface (Pure GPU-Composited CSS, Zero Extra WebGL Contexts) */}
                <div className="relative w-full h-[148px] sm:h-[168px] rounded-[22px] overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-[0_12px_32px_rgba(2,4,14,0.6)] bg-[#060B22] flex items-center justify-center">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 35%, rgba(47, 107, 255, 0.32), transparent 58%), radial-gradient(circle at 72% 68%, rgba(123, 77, 255, 0.28), transparent 58%), radial-gradient(circle at 50% 50%, rgba(242, 184, 75, 0.12), transparent 65%)',
                    }}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={handleOrionAiBurst}
                    data-cursor-hover="true"
                    className="group relative z-10 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#2F6BFF]/30 via-[#7B4DFF]/30 to-[#2F6BFF]/30 border border-[rgba(255,255,255,0.22)] hover:border-[#2F6BFF]/70 shadow-[0_0_36px_rgba(47,107,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_0_48px_rgba(123,77,255,0.65)] transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F2B84B] transition-transform duration-300 group-hover:rotate-12" />
                    <span className="font-display font-bold text-[15px] sm:text-[16px] tracking-[0.16em] text-[#F5F7FF]">
                      ORION AI
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Thin Divider & Three Animated Counters */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.98, ease: ORION_EASE }}
              className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.08)] w-full grid grid-cols-3 gap-4 sm:gap-8"
            >
              <AnimatedCounter target={50} suffix="+" label="PROJECTS DONE" />
              <AnimatedCounter target={100} suffix="%" label="SATISFACTION" />
              <AnimatedCounter target={5} suffix="+" label="YEARS EXP." />
            </motion.div>
          </div>

          {/* RIGHT COLUMN (5 Columns on Desktop): Interactive 3D Orion Logo Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: ORION_EASE }}
            className="lg:col-span-5 w-full flex items-center justify-center overflow-visible bg-transparent"
          >
            <Suspense
              fallback={
                <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[560px] flex items-center justify-center">
                  <SafeImage
                    src="/images/orion-logo.svg"
                    alt="ORION IT SOLUTIONS 3D Emblem"
                    width={280}
                    height={280}
                    priority
                    className="w-56 h-56 sm:w-72 sm:h-72 object-contain opacity-85"
                  />
                </div>
              }
            >
              <HeroOrionScene />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Bottom of Hero: Scroll Indicator + Slow Infinite Marquee Strip */}
      <div className="w-full mt-14 md:mt-20">
        {/* Scroll Down Indicator */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-7 flex items-center justify-between">
          <a
            href="#about"
            onClick={(e) => handleScrollTo(e, '#about')}
            data-cursor-hover="true"
            className="group inline-flex items-center gap-3 font-mono-label text-[11px] text-[#8B93B7] hover:text-[#F5F7FF] transition-colors"
          >
            <span className="w-7 h-11 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.03)] flex items-start justify-center p-1.5 group-hover:border-[#2F6BFF]/60 transition-colors">
              <motion.span
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-2.5 rounded-full bg-[#2F6BFF] shadow-[0_0_8px_#2F6BFF]"
              />
            </span>
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#2F6BFF] transition-transform group-hover:translate-y-0.5" />
          </a>

          <span className="hidden sm:inline-block font-mono-label text-[10px] text-[#8B93B7]/70">
            31.5204° N, 74.3587° E · LAHORE
          </span>
        </div>

        {/* Slow Infinite Marquee Strip */}
        <div className="w-full border-y border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md py-4 overflow-hidden select-none">
          <div className="orion-marquee-track items-center">
            {[0, 1, 2, 3].map((groupIndex) => (
              <div
                key={groupIndex}
                className="flex items-center shrink-0"
                aria-hidden={groupIndex > 0 ? 'true' : undefined}
              >
                {MARQUEE_ITEMS.map((item) => (
                  <div key={`${groupIndex}-${item}`} className="flex items-center shrink-0">
                    <span className="font-mono-label text-[11px] sm:text-[12px] text-[#F5F7FF]/90 tracking-[0.16em] px-6 sm:px-8">
                      {item}
                    </span>
                    <span
                      className="text-[#2F6BFF] text-[14px] leading-none select-none"
                      aria-hidden="true"
                    >
                      •
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
