import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Zap, Compass, Layers, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../components/SectionHeading';
import { getDeviceTier } from '../lib/deviceTier';

gsap.registerPlugin(ScrollTrigger);

interface TiltBentoCardProps {
  children: React.ReactNode;
  className?: string;
  highlightBorder?: boolean;
}

function TiltBentoCard({
  children,
  className = '',
  highlightBorder = false,
}: TiltBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const tier = getDeviceTier();
    if (tier === 'low' || !cardRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Cursor-following radial glow coordinates
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      el.style.setProperty('--spotlight-opacity', '1');

      // Subtle 3D tilt perspective transform
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;
        el.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--spotlight-opacity', '0');
    el.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition:
          'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      className={`orion-about-card orion-glass-card ${
        highlightBorder
          ? 'border-[#2F6BFF]/40 shadow-[0_0_45px_rgba(47,107,255,0.16),inset_0_1px_1px_rgba(255,255,255,0.14)]'
          : ''
      } ${className}`}
    >
      {highlightBorder && (
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none opacity-65"
          style={{
            background:
              'linear-gradient(135deg, rgba(47,107,255,0.14) 0%, rgba(123,77,255,0.08) 50%, rgba(242,184,75,0.06) 100%)',
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
}

interface PillarCounterProps {
  target: number;
  suffix: string;
  label: string;
  accent?: 'blue' | 'gold' | 'green';
}

function PillarCounter({ target, suffix, label, accent = 'blue' }: PillarCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    const duration = 1700;
    let rafId: number;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target]);

  const suffixClass =
    accent === 'gold'
      ? 'text-[#F2B84B]'
      : accent === 'green'
      ? 'text-[#22C55E]'
      : 'text-signature-gradient';

  return (
    <div
      ref={ref}
      className="p-4 sm:p-5 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] flex flex-col justify-between"
    >
      <div className="font-display font-extrabold text-[26px] sm:text-[32px] text-[#F5F7FF] tracking-tight tabular-nums leading-none">
        {value}
        <span className={suffixClass}>{suffix}</span>
      </div>
      <span className="font-mono-label text-[10px] sm:text-[11px] text-[#8B93B7] mt-2.5 leading-snug">
        {label}
      </span>
    </div>
  );
}

/**
 * Animated SVG of the three Orion belt stars lighting up in sequence (blue, gold, blue)
 * when scrolled into view.
 */
function OrionBeltSvg() {
  const svgRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(svgRef, { once: false, margin: '-50px' });

  return (
    <div
      ref={svgRef}
      className="mt-6 p-5 rounded-2xl bg-[#050816]/75 border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-4"
    >
      <div className="flex flex-col">
        <span className="font-mono-label text-[10px] text-[#8B93B7]">
          CONSTELLATION ALIGNMENT
        </span>
        <span className="font-mono-label text-[11px] text-[#F5F7FF] mt-1">
          ALNITAK · ALNILAM · MINTAKA
        </span>
      </div>

      <svg
        width="168"
        height="68"
        viewBox="0 0 168 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="Three Orion belt stars lighting up in sequence: electric blue, champagne gold, electric blue"
      >
        <defs>
          <linearGradient id="beltConnectGrad" x1="26" y1="52" x2="142" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#F2B84B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="beltBlueGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="beltGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2B84B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F2B84B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connecting diagonal line */}
        <motion.line
          x1="26"
          y1="52"
          x2="142"
          y2="16"
          stroke="url(#beltConnectGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Star 1: Left Electric Blue */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '26px 52px' }}
        >
          <circle cx="26" cy="52" r="16" fill="url(#beltBlueGlow)" />
          <circle cx="26" cy="52" r="5.5" fill="#2F6BFF" />
          <circle cx="26" cy="52" r="2.2" fill="#F5F7FF" />
        </motion.g>

        {/* Star 2: Center Champagne Gold */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '84px 34px' }}
        >
          <circle cx="84" cy="34" r="22" fill="url(#beltGoldGlow)" />
          <circle cx="84" cy="34" r="7" fill="#F2B84B" />
          <circle cx="84" cy="34" r="2.8" fill="#FFF7DE" />
        </motion.g>

        {/* Star 3: Right Electric Blue */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '142px 16px' }}
        >
          <circle cx="142" cy="16" r="16" fill="url(#beltBlueGlow)" />
          <circle cx="142" cy="16" r="5.5" fill="#2F6BFF" />
          <circle cx="142" cy="16" r="2.2" fill="#F5F7FF" />
        </motion.g>
      </svg>
    </div>
  );
}

const CLIENT_SECTORS = [
  'Architecture Firms',
  'Interior Designers',
  'Restaurants & Cafes',
  'Skincare & Lifestyle Brands',
  'Clinics & Centers',
  'Startups',
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.orion-about-card');
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[140px]"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section Headline */}
        <div className="mb-14 md:mb-16">
          <SectionHeading
            eyebrow="01 / THE COMPANY"
            firstLine="DESIGN THAT FEELS"
            secondLine="LIKE THE FUTURE."
          />
        </div>

        {/* 2-Column Bento Grid on Desktop, 1 Column on Mobile */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
        >
          {/* 1. Card "WHO WE ARE" */}
          <TiltBentoCard className="p-8 md:p-10">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/35 flex items-center justify-center text-[#2F6BFF] shadow-[0_0_20px_rgba(47,107,255,0.25)] shrink-0">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-mono-label text-[12px] font-semibold text-[#F5F7FF]">
                  WHO WE ARE
                </span>
              </div>

              <p className="font-body text-[16px] md:text-[17px] leading-[1.7] text-[#8B93B7]">
                ORION IT SOLUTIONS is a founder-led digital solutions brand delivering premium
                digital experiences for businesses, with a special focus on architecture and
                interior design firms. We combine modern web design, brand identity and AI
                automation to help brands stand out online.
              </p>
            </div>

            {/* Mono-styled quote box */}
            <div className="mt-7 p-5 rounded-2xl bg-[#050816]/80 border border-[rgba(47,107,255,0.28)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
              <p className="font-mono-label text-[11px] sm:text-[12px] leading-[1.65] text-[#F5F7FF]">
                &ldquo;Every brand has a star inside it. We design the sky around it.&rdquo;
              </p>
            </div>
          </TiltBentoCard>

          {/* 2. Card "OUR MISSION" */}
          <TiltBentoCard className="p-8 md:p-10">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/35 flex items-center justify-center text-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.25)] shrink-0">
                  <Zap className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-mono-label text-[12px] font-semibold text-[#F5F7FF]">
                  OUR MISSION
                </span>
              </div>

              <p className="font-body text-[16px] md:text-[17px] leading-[1.7] text-[#8B93B7]">
                To help businesses shine by marrying Apple-level design aesthetics with autonomous
                AI systems.
              </p>
            </div>

            {/* Two mini cards inside */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.08)]">
                <div className="font-mono-label text-[10px] text-[#2F6BFF] mb-1.5">
                  AESTHETIC FOCUS
                </div>
                <div className="font-body font-semibold text-[15px] text-[#F5F7FF]">
                  Apple &amp; Linear Luxury
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(34,197,94,0.22)]">
                <div className="font-mono-label text-[10px] text-[#22C55E] mb-1.5">
                  AI OBJECTIVE
                </div>
                <div className="font-body font-semibold text-[15px] text-[#F5F7FF]">
                  Zero-Touch Enquiry Handling
                </div>
              </div>
            </div>
          </TiltBentoCard>

          {/* 3. Card "WHY ORION?" */}
          <TiltBentoCard className="p-8 md:p-10">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#F2B84B]/15 border border-[#F2B84B]/35 flex items-center justify-center text-[#F2B84B] shadow-[0_0_20px_rgba(242,184,75,0.22)] shrink-0">
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-mono-label text-[12px] font-semibold text-[#F5F7FF]">
                  WHY ORION?
                </span>
              </div>

              <p className="font-body text-[16px] md:text-[17px] leading-[1.7] text-[#8B93B7]">
                Orion is the constellation everyone can find in the night sky. Three belt stars in
                a line, simple, unmistakable, guiding. That is how we design: clear, confident,
                memorable.
              </p>
            </div>

            <OrionBeltSvg />
          </TiltBentoCard>

          {/* 4. Card "CORE PILLARS" (large, gradient border glow) */}
          <TiltBentoCard highlightBorder className="p-8 md:p-10">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2F6BFF]/25 to-[#7B4DFF]/25 border border-[#2F6BFF]/40 flex items-center justify-center text-[#F5F7FF] shrink-0">
                    <Layers className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-mono-label text-[12px] font-semibold text-[#F5F7FF]">
                    CORE PILLARS
                  </span>
                </div>
                <span className="font-mono-label text-[10px] text-[#F2B84B]">
                  STUDIO BENCHMARKS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PillarCounter
                target={5}
                suffix="+"
                label="YEARS DESIGN MASTERY"
                accent="blue"
              />
              <PillarCounter
                target={50}
                suffix="+"
                label="PROJECTS DELIVERED"
                accent="blue"
              />
              <PillarCounter
                target={100}
                suffix="%"
                label="CLIENT SATISFACTION"
                accent="gold"
              />
              <PillarCounter
                target={24}
                suffix="/7"
                label="AI ENQUIRY HANDLING"
                accent="green"
              />
            </div>
          </TiltBentoCard>

          {/* 5. Wide Card "WHO WE WORK WITH" */}
          <TiltBentoCard className="lg:col-span-2 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-3.5 shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-[#7B4DFF]/15 border border-[#7B4DFF]/35 flex items-center justify-center text-[#7B4DFF] shadow-[0_0_20px_rgba(123,77,255,0.25)] shrink-0">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-mono-label text-[12px] font-semibold text-[#F5F7FF] block">
                    WHO WE WORK WITH
                  </span>
                  <span className="font-body text-[14px] text-[#8B93B7] mt-0.5 block">
                    Specialized digital partnerships tailored for design-forward industries
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {CLIENT_SECTORS.map((sector, idx) => {
                  const isPrimaryFocus = idx < 2;
                  return (
                    <span
                      key={sector}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-[13px] sm:text-[14px] font-medium transition-colors ${
                        isPrimaryFocus
                          ? 'bg-gradient-to-r from-[#2F6BFF]/20 to-[#7B4DFF]/20 border border-[#2F6BFF]/45 text-[#F5F7FF] shadow-[0_0_20px_rgba(47,107,255,0.18)]'
                          : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-[#F5F7FF]/90 hover:border-[#2F6BFF]/40'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPrimaryFocus ? 'bg-[#F2B84B]' : 'bg-[#2F6BFF]'
                        }`}
                        aria-hidden="true"
                      />
                      {sector}
                    </span>
                  );
                })}
              </div>
            </div>
          </TiltBentoCard>
        </div>
      </div>
    </section>
  );
}
