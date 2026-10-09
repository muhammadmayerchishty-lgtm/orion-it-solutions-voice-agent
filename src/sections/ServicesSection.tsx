import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Globe,
  Figma,
  Palette,
  Megaphone,
  Building2,
  Sparkles,
  Workflow,
  Mic,
  Plus,
  Minus,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../components/SectionHeading';
import { PillButton } from '../components/PillButton';
import { useSmoothScroll } from '../components/SmoothScrollProvider';
import { getDeviceTier } from '../lib/deviceTier';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: 'SPECIALITY' | 'FLAGSHIP';
  accent: 'blue' | 'gold' | 'ai';
  bullets: [string, string, string];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    number: '01',
    title: 'Premium Website Design & Development',
    description: 'Fast, responsive, conversion-focused websites built with modern tech.',
    icon: Globe,
    accent: 'blue',
    bullets: [
      'Custom React, TypeScript & WebGL frontends',
      'Sub-second page loads & mobile-first responsiveness',
      'SEO-ready architecture built to convert visitors',
    ],
  },
  {
    number: '02',
    title: 'UI/UX Design',
    description:
      'Interfaces and user journeys designed to feel effortless and look unforgettable.',
    icon: Figma,
    accent: 'blue',
    bullets: [
      'Interactive Figma prototypes & design systems',
      'Intuitive user flows & conversion-led wireframes',
      'Micro-interactions and tactile motion choreography',
    ],
  },
  {
    number: '03',
    title: 'Graphic Design & Brand Identity',
    description:
      'Logos, visual systems and brand presentations that make you instantly recognisable.',
    icon: Palette,
    accent: 'blue',
    bullets: [
      'Distinctive brand marks & typographic hierarchies',
      'Comprehensive visual identity guidelines',
      'Executive pitch decks & company profile systems',
    ],
  },
  {
    number: '04',
    title: 'Social Media & Marketing Design',
    description: 'Scroll-stopping creatives, campaigns and promotional material.',
    icon: Megaphone,
    accent: 'blue',
    bullets: [
      'Cohesive social grid systems & story templates',
      'High-impact ad creatives for paid campaigns',
      'Launch assets tailored for brand engagement',
    ],
  },
  {
    number: '05',
    title: 'Architecture & Interior Design Firm Websites',
    description: 'Cinematic project showcases made for architects and interior designers.',
    icon: Building2,
    badge: 'SPECIALITY',
    accent: 'gold',
    bullets: [
      'Full-bleed spatial galleries & blueprint viewers',
      'Editorial case studies organized by typology & scale',
      'Tailored consultation & private brief capture flows',
    ],
  },
  {
    number: '06',
    title: 'Digital Portfolios & Interactive Showcases',
    description: 'Immersive portfolios that present your best work like a gallery.',
    icon: Sparkles,
    accent: 'blue',
    bullets: [
      '3D WebGL & smooth-scroll narrative showcases',
      'Curated media filtering & high-resolution lookbooks',
      'Memorable personal & studio flagship sites',
    ],
  },
  {
    number: '07',
    title: 'AI Automation & Workflow Solutions',
    description:
      'Automations that capture leads, route enquiries and save hours every week.',
    icon: Workflow,
    badge: 'FLAGSHIP',
    accent: 'ai',
    bullets: [
      'Automated WhatsApp, email & CRM lead routing',
      'Instant client onboarding & proposal pipelines',
      'Custom multi-step business workflow integrations',
    ],
  },
  {
    number: '08',
    title: 'AI Voice Agents & AI-Powered Enquiry Experiences',
    description:
      'Voice receptionists that answer, qualify and book clients around the clock.',
    icon: Mic,
    badge: 'FLAGSHIP',
    accent: 'ai',
    bullets: [
      '24/7 natural-sounding AI voice receptionists',
      'Automated project budget & timeline qualification',
      'Direct calendar appointment booking synchronization',
    ],
  },
];

function ServiceCard({ item }: { item: ServiceItem }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const IconComponent = item.icon;
  const isHighlighted = Boolean(item.badge);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (getDeviceTier() === 'low' || !cardRef.current) return;
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

      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      el.style.setProperty('--spotlight-opacity', '1');

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;
        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
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

  const highlightBorderClasses =
    item.accent === 'gold'
      ? 'border-[#F2B84B]/45 shadow-[0_0_38px_rgba(242,184,75,0.14),inset_0_1px_1px_rgba(242,184,75,0.2)]'
      : item.accent === 'ai'
      ? 'border-[#22C55E]/45 shadow-[0_0_38px_rgba(34,197,94,0.14),inset_0_1px_1px_rgba(34,197,94,0.2)]'
      : '';

  const badgeClasses =
    item.accent === 'gold'
      ? 'bg-[#F2B84B]/15 text-[#F2B84B] border-[#F2B84B]/40'
      : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40';

  const iconBoxClasses =
    item.accent === 'gold'
      ? 'from-[#F2B84B]/25 to-[#2F6BFF]/20 border-[#F2B84B]/45 text-[#F2B84B]'
      : item.accent === 'ai'
      ? 'from-[#22C55E]/25 to-[#2F6BFF]/20 border-[#22C55E]/45 text-[#22C55E]'
      : 'from-[#2F6BFF]/25 to-[#7B4DFF]/25 border-[#2F6BFF]/40 text-[#2F6BFF]';

  const bulletDotColor =
    item.accent === 'gold'
      ? 'bg-[#F2B84B]'
      : item.accent === 'ai'
      ? 'bg-[#22C55E]'
      : 'bg-[#2F6BFF]';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition:
          'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      className={`orion-service-card orion-glass-card group p-7 flex flex-col justify-between ${
        isHighlighted ? highlightBorderClasses : ''
      }`}
    >
      {isHighlighted && (
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none opacity-60"
          style={{
            background:
              item.accent === 'gold'
                ? 'radial-gradient(circle at 100% 0%, rgba(242, 184, 75, 0.14), transparent 55%)'
                : 'radial-gradient(circle at 100% 0%, rgba(34, 197, 94, 0.14), transparent 55%)',
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        {/* Top Row: Big Mono Number + Floating Icon & Optional Highlight Badge */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex flex-col">
            <span className="font-mono-label text-[26px] sm:text-[28px] font-bold text-[#F5F7FF]/25 group-hover:text-[#F5F7FF]/55 transition-colors leading-none tabular-nums">
              {item.number}
            </span>
            {item.badge && (
              <span
                className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono-label text-[9px] font-semibold ${badgeClasses}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.accent === 'gold' ? 'bg-[#F2B84B]' : 'bg-[#22C55E]'
                  }`}
                />
                {item.badge}
              </span>
            )}
          </div>

          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br border flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105 ${iconBoxClasses}`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
        </div>

        {/* Service Title */}
        <h3 className="font-body font-bold text-[18px] text-[#F5F7FF] leading-[1.35] mb-3">
          {item.title}
        </h3>

        {/* 2-Line Description */}
        <p className="font-body text-[14px] leading-[1.6] text-[#8B93B7]">
          {item.description}
        </p>

        {/* Expandable Inline Details Drawer */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] space-y-2.5">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 font-body text-[13px] text-[#F5F7FF]/90 leading-snug"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${bulletDotColor}`}
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Interactive "LEARN MORE +" Mono Toggle */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          data-cursor-hover="true"
          className="min-h-[44px] inline-flex items-center gap-1.5 font-mono-label text-[11px] font-medium text-[#F5F7FF]/85 hover:text-[#2F6BFF] transition-colors cursor-pointer"
        >
          <span>{expanded ? 'SHOW LESS' : 'LEARN MORE'}</span>
          {expanded ? (
            <Minus className="w-3.5 h-3.5 text-[#2F6BFF]" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-[#2F6BFF]" />
          )}
        </button>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.orion-service-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleBookConsultation = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    scrollTo('#contact', -20);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[140px]"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section Headline & Intro */}
        <div className="mb-14 md:mb-16">
          <SectionHeading
            eyebrow="02 / SERVICES"
            firstLine="WHAT WE"
            secondLine="CREATE."
            subtitle="From first impression to automated enquiry, everything your brand needs in one studio."
          />
        </div>

        {/* 8 Service Cards Grid: 4 cols desktop, 2 tablet, 1 mobile */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.number} item={service} />
          ))}
        </div>

        {/* Final Wide CTA Strip Below Grid */}
        <div
          ref={ctaRef}
          className="mt-12 md:mt-14 orion-glass-card p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-[#2F6BFF]/30"
        >
          <div>
            <span className="font-mono-label text-[10px] text-[#2F6BFF] block mb-2">
              TAILORED DIGITAL STRATEGY
            </span>
            <h3 className="font-display font-bold text-[20px] sm:text-[24px] uppercase text-[#F5F7FF] tracking-tight">
              Not sure what you need?
            </h3>
            <p className="font-body text-[14px] sm:text-[15px] text-[#8B93B7] mt-1">
              Let&apos;s map out the exact website, brand system, or AI automation workflow for your firm.
            </p>
          </div>

          <PillButton
            variant="primary"
            size="lg"
            href="#contact"
            onClick={handleBookConsultation}
          >
            BOOK A FREE CONSULTATION
          </PillButton>
        </div>
      </div>
    </section>
  );
}
