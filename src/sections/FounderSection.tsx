import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Globe,
  Linkedin,
  Instagram,
  Mail,
  Scale,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../components/SectionHeading';
import { PillButton } from '../components/PillButton';
import { SafeImage } from '../components/SafeImage';
import { getDeviceTier } from '../lib/deviceTier';

gsap.registerPlugin(ScrollTrigger);

const FOUNDER_SKILLS = [
  'Web Development',
  'UI/UX Design',
  'Graphic Design',
  'Brand Identity',
  'AI Automation',
  'AI Voice Agents',
  'Digital Portfolios',
  'Client Acquisition',
];

const SOCIAL_LINKS = [
  {
    label: 'Portfolio',
    href: 'https://muhammad-mayer-portfolio.vercel.app/',
    icon: Globe,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-mayer-chishty-8b269341a/',
    icon: Linkedin,
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mayeroutreach_1',
    icon: Instagram,
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:muhammadmayerchishty@gmail.com',
    icon: Mail,
    external: false,
  },
];

export function FounderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const portraitCardRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        const items = leftColRef.current.querySelectorAll('.founder-reveal');
        gsap.fromTo(
          items,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (portraitCardRef.current) {
        gsap.fromTo(
          portraitCardRef.current,
          { y: 48, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (getDeviceTier() === 'low' || !portraitCardRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = portraitCardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      const rotateX = normY * -5.5;
      const rotateY = normX * 5.5;

      el.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
      if (portraitImgRef.current) {
        portraitImgRef.current.style.transform = `scale(1.06) translate3d(${(normX * -10).toFixed(1)}px, ${(normY * -10).toFixed(1)}px, 0)`;
      }
    });
  };

  const handlePortraitMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = portraitCardRef.current;
    if (el) {
      el.style.transform = '';
    }
    if (portraitImgRef.current) {
      portraitImgRef.current.style.transform = 'scale(1.06) translate3d(0px, 0px, 0)';
    }
  };

  return (
    <section
      id="founder"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[140px] overflow-hidden"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* LEFT COLUMN (7 Columns on Desktop) */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col items-start">
            <div className="founder-reveal">
              <SectionHeading
                eyebrow="03 / THE FOUNDER"
                firstLine="MEET THE MIND"
                secondLine="BEHIND ORION."
              />
            </div>

            <p className="founder-reveal mt-6 font-body text-[16px] md:text-[18px] leading-[1.7] text-[#8B93B7]">
              I am Muhammad Mayer Chishty, a Web Developer, Graphic Designer, UI/UX Designer
              and AI Automation Specialist based in Lahore, Pakistan. I founded ORION IT
              SOLUTIONS to deliver premium digital experiences that help businesses strengthen
              their online presence, with a special focus on architecture and interior design
              firms.
            </p>

            {/* Mono-styled Quote Box */}
            <div className="founder-reveal mt-7 w-full p-6 rounded-[28px] bg-[rgba(255,255,255,0.03)] border border-[rgba(47,107,255,0.28)] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <div className="inline-flex items-center gap-2 mb-3">
                <Scale className="w-3.5 h-3.5 text-[#F2B84B]" aria-hidden="true" />
                <span className="font-mono-label text-[10px] sm:text-[11px] font-semibold text-[#F2B84B] tracking-[0.14em]">
                  LAW STUDENT x DESIGNER x DEVELOPER
                </span>
              </div>
              <p className="font-mono-label text-[11.5px] sm:text-[12.5px] leading-[1.7] text-[#F5F7FF] normal-case tracking-[0.03em]">
                &ldquo;Legal training teaches you to scrutinise every clause. I apply that same
                precision to every line of code, UI layout and automation logic.&rdquo;
              </p>
            </div>

            {/* Animated Skill Chips */}
            <div className="founder-reveal mt-7 w-full">
              <div className="font-mono-label text-[10px] text-[#8B93B7] mb-3">
                CORE DISCIPLINES &amp; SPECIALISATIONS
              </div>
              <div className="flex flex-wrap gap-2.5">
                {FOUNDER_SKILLS.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:border-[#2F6BFF]/50 hover:bg-[#2F6BFF]/10 font-mono-label text-[10.5px] text-[#F5F7FF] transition-all duration-200"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        skill.includes('AI')
                          ? 'bg-[#22C55E]'
                          : idx % 3 === 0
                          ? 'bg-[#F2B84B]'
                          : 'bg-[#2F6BFF]'
                      }`}
                      aria-hidden="true"
                    />
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Social Icon Row + Primary Appointment CTA */}
            <div className="founder-reveal mt-8 flex flex-wrap items-center gap-4 w-full">
              <PillButton
                variant="primary"
                size="lg"
                href="https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20would%20like%20to%20book%20an%20appointment."
                onClick={(e) => {
                  e.preventDefault();
                  const a = document.createElement('a');
                  a.href =
                    'https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20would%20like%20to%20book%20an%20appointment.';
                  a.target = '_blank';
                  a.rel = 'noopener noreferrer';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                BOOK AN APPOINTMENT
              </PillButton>

              {/* Icon Buttons with Hover Glow */}
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      aria-label={item.label}
                      title={item.label}
                      data-cursor-hover="true"
                      className="w-11 h-11 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#8B93B7] hover:text-[#F5F7FF] hover:border-[#2F6BFF]/60 hover:bg-[#2F6BFF]/15 hover:shadow-[0_0_24px_rgba(47,107,255,0.45)] transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Small Availability Card */}
            <div className="founder-reveal mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
              </span>
              <span className="font-body text-[13.5px] text-[#F5F7FF]/90">
                Available for freelance and remote projects.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Columns on Desktop): Rounded-[40px] Portrait Card + Orbiting Orion Belt Stars */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Tiny Orbiting Animation of the Three Orion Belt Stars Behind the Card */}
            <div
              className="absolute -inset-6 sm:-inset-10 pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              {/* Soft outer ambient glow */}
              <div
                className="w-full h-full rounded-[48px]"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(47, 107, 255, 0.25) 0%, rgba(123, 77, 255, 0.16) 48%, transparent 72%)',
                  filter: 'blur(28px)',
                }}
              />

              {/* Orbiting SVG Ring with the 3 Orion Belt Stars */}
              <motion.svg
                viewBox="0 0 460 540"
                className="absolute w-[112%] h-[112%] overflow-visible opacity-90"
                animate={{ rotate: 360 }}
                transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <linearGradient id="founderOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#7B4DFF" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#F2B84B" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <ellipse
                  cx="230"
                  cy="270"
                  rx="215"
                  ry="250"
                  fill="none"
                  stroke="url(#founderOrbitGrad)"
                  strokeWidth="1"
                  strokeDasharray="6 10"
                />
                {/* Star 1: Electric Blue */}
                <g transform="translate(230, 20)">
                  <circle r="9" fill="#2F6BFF" fillOpacity="0.3" />
                  <circle r="4" fill="#2F6BFF" />
                  <circle r="1.5" fill="#F5F7FF" />
                </g>
                {/* Star 2: Champagne Gold */}
                <g transform="translate(445, 270)">
                  <circle r="12" fill="#F2B84B" fillOpacity="0.35" />
                  <circle r="5" fill="#F2B84B" />
                  <circle r="2" fill="#FFF7DE" />
                </g>
                {/* Star 3: Electric Blue */}
                <g transform="translate(15, 270)">
                  <circle r="9" fill="#2F6BFF" fillOpacity="0.3" />
                  <circle r="4" fill="#2F6BFF" />
                  <circle r="1.5" fill="#F5F7FF" />
                </g>
              </motion.svg>
            </div>

            {/* Rounded-[40px] Portrait Card with Thin Blue-Violet Gradient Border */}
            <div
              ref={portraitCardRef}
              onMouseMove={handlePortraitMouseMove}
              onMouseLeave={handlePortraitMouseLeave}
              style={{
                transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="relative w-full max-w-[440px] aspect-[4/5] rounded-[40px] p-[1.5px] bg-gradient-to-br from-[#2F6BFF] via-[#7B4DFF]/70 to-[#2F6BFF]/30 shadow-[0_28px_70px_rgba(2,4,14,0.85),0_0_45px_rgba(47,107,255,0.22)] overflow-hidden group"
            >
              <div className="relative w-full h-full rounded-[38.5px] overflow-hidden bg-[#0A0E24]">
                {!imgFailed ? (
                  <SafeImage
                    imgRef={portraitImgRef}
                    src="/images/founder.webp"
                    fallbackSrc="/images/founder.jpg"
                    alt="Muhammad Mayer Chishty — Founder & Creative Director of ORION IT SOLUTIONS"
                    width={440}
                    height={550}
                    onError={() => setImgFailed(true)}
                    style={{
                      transform: 'scale(1.06) translate3d(0px, 0px, 0)',
                      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    className="w-full h-full object-cover object-top select-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0D1538] to-[#050816]">
                    <div className="font-display font-bold text-3xl text-[#F5F7FF]">MMC</div>
                    <div className="font-mono-label text-xs text-[#2F6BFF] mt-2">
                      MUHAMMAD MAYER CHISHTY
                    </div>
                  </div>
                )}

                {/* Subtle bottom gradient scrim for legibility */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(5, 8, 22, 0.92) 0%, rgba(5, 8, 22, 0.45) 50%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Glass Info Bar at Bottom Inside the Image */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5 p-4 sm:p-5 rounded-[26px] bg-[#050816]/75 border border-[rgba(255,255,255,0.14)] backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-between gap-3">
                  <div>
                    <div className="font-body font-bold text-[17px] sm:text-[19px] text-[#F5F7FF] leading-tight">
                      Muhammad Mayer Chishty
                    </div>
                    <div className="font-mono-label text-[10px] sm:text-[11px] text-[#2F6BFF] font-semibold mt-1">
                      FOUNDER &amp; CREATIVE DIRECTOR
                    </div>
                  </div>

                  <a
                    href="https://muhammad-mayer-portfolio.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Muhammad Mayer Chishty Portfolio"
                    data-cursor-hover="true"
                    className="w-11 h-11 rounded-full bg-[#2F6BFF] text-[#F5F7FF] border border-[#6C98FF]/50 shadow-[0_0_20px_rgba(47,107,255,0.55)] hover:bg-[#3B76FF] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
