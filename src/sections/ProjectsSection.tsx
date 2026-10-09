import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Lock,
  Plus,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../components/SectionHeading';
import { PillButton } from '../components/PillButton';
import { SafeImage } from '../components/SafeImage';

gsap.registerPlugin(ScrollTrigger);

interface ProjectItem {
  number: string;
  name: string;
  domain: string;
  description: string;
  tags: string[];
  skills: string[];
  link: string;
  screenshot: string;
  accentGradient: string;
  accentColor: string;
  caseStudy: {
    challenge: string;
    solution: string;
    highlights: string[];
  };
}

const PROJECTS_LIST: ProjectItem[] = [
  {
    number: '01',
    name: 'GLOW THEORY',
    domain: 'glowtheory1.lovable.app',
    description:
      'A luxury skincare brand experience. Full-stack and UI/UX design with a cinematic product-led look.',
    tags: ['UI/UX', 'Web Development', 'Luxury E-commerce'],
    skills: ['React', 'TypeScript', 'Editorial UI/UX', 'Luxury Brand System', 'Motion Design'],
    link: 'https://glowtheory1.lovable.app/',
    screenshot: '/images/glow-theory.webp',
    accentGradient: 'linear-gradient(135deg, #1E295B 0%, #3E286B 48%, #70483C 100%)',
    accentColor: '#F2B84B',
    caseStudy: {
      challenge:
        'Position a modern skincare line alongside heritage luxury houses through tactile typography, editorial product storytelling, and frictionless checkout.',
      solution:
        'Engineered a high-contrast, product-led flagship store with silky scroll transitions, ingredient spotlights, and sensory micro-interactions.',
      highlights: [
        'Bespoke luxury product showcase & regimen builder',
        'Editorial art direction with fluid mobile-first commerce',
        'Conversion-architected product detail & checkout journey',
      ],
    },
  },
  {
    number: '02',
    name: 'BAKEBRIEF',
    domain: 'bakebrief-app.vercel.app',
    description:
      'A bakery brand website with an integrated AI calling agent that answers customer calls and handles enquiries.',
    tags: ['AI Voice Agent', 'Web Development', 'IT Integration'],
    skills: ['AI Voice Agent', 'React & Next.js', 'Automated Order Routing', 'UI/UX Design'],
    link: 'https://bakebrief-app.vercel.app/',
    screenshot: '/images/bakebrief.webp',
    accentGradient: 'linear-gradient(135deg, #102A45 0%, #164E3F 50%, #1F244D 100%)',
    accentColor: '#22C55E',
    caseStudy: {
      challenge:
        'Artisan bakeries miss dozens of custom cake and catering orders during peak baking hours when staff cannot answer the phone.',
      solution:
        'Paired an appetizing digital storefront with a 24/7 autonomous AI voice receptionist that answers customer calls, takes custom order briefs, and logs enquiries automatically.',
      highlights: [
        '24/7 AI voice receptionist handling live customer calls',
        'Automated enquiry capture & order specification summary',
        'Warm, tactile brand showcase with instant menu browsing',
      ],
    },
  },
  {
    number: '03',
    name: 'ARC STUDIO',
    domain: 'arc-studio-websitem-ndkv.vercel.app',
    description:
      'A premium website demo for an architecture and interior design firm, with an immersive project showcase.',
    tags: ['Architecture', 'Interior Design', 'Web Design'],
    skills: ['Spatial Showcase', 'Architectural Grid', 'Smooth Scroll', 'Enquiry Funnel'],
    link: 'https://arc-studio-websitem-ndkv.vercel.app/',
    screenshot: '/images/arc-studio.webp',
    accentGradient: 'linear-gradient(135deg, #0D1B3E 0%, #1E3266 50%, #3A2463 100%)',
    accentColor: '#2F6BFF',
    caseStudy: {
      challenge:
        'Architecture and interior design firms need digital spaces that feel as composed and spatial as the physical environments they build.',
      solution:
        'Crafted an architectural web showcase featuring full-bleed project monographs, refined typographic grids, and an integrated consultation request flow.',
      highlights: [
        'Gallery-grade project monographs with spatial filtering',
        'Minimalist editorial typography & blueprint-inspired grid',
        'High-intent private client consultation capture',
      ],
    },
  },
];

function BrowserMockup({
  project,
  onOpenModal,
}: {
  project: ProjectItem;
  onOpenModal?: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onOpenModal}
      data-cursor-hover="true"
      className="group/mockup relative w-full aspect-[16/10] rounded-[26px] overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#060A1E] shadow-[0_24px_60px_rgba(2,4,14,0.85)] flex flex-col cursor-pointer"
    >
      {/* macOS Style Browser Top Bar */}
      <div className="h-9 sm:h-10 px-4 bg-[#0A1029]/95 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/85" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/85" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/85" />
        </div>

        {/* Fake Address Bar showing real domain */}
        <div className="flex-1 max-w-[280px] sm:max-w-[340px] h-6 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] px-3 flex items-center justify-center gap-1.5">
          <Lock className="w-2.5 h-2.5 text-[#22C55E] shrink-0" aria-hidden="true" />
          <span className="font-mono-label text-[9.5px] text-[#8B93B7] truncate lowercase tracking-wider">
            {project.domain}
          </span>
        </div>

        <div className="w-10 flex justify-end">
          <ExternalLink className="w-3.5 h-3.5 text-[#8B93B7] group-hover/mockup:text-[#F5F7FF] transition-colors" />
        </div>
      </div>

      {/* Viewport Area with Slow Auto-Pan on Hover */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#050816]">
        {!imgError ? (
          <SafeImage
            src={project.screenshot}
            alt={`${project.name} Live Website Preview`}
            width={800}
            height={500}
            placeholderGradient={project.accentGradient}
            onError={() => setImgError(true)}
            className="w-full h-[128%] object-cover object-top transition-transform duration-[3400ms] ease-out group-hover/mockup:-translate-y-[16%] group-hover/mockup:scale-[1.03]"
          />
        ) : (
          /* Elegant Gradient Architectural Placeholder with Slow Auto-Pan on Hover */
          <div
            style={{ background: project.accentGradient }}
            className="w-full h-[128%] p-6 sm:p-8 flex flex-col justify-between transition-transform duration-[3400ms] ease-out group-hover/mockup:-translate-y-[14%] group-hover/mockup:scale-[1.03] relative"
          >
            {/* Subtle Architectural Grid Lines */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono-label text-[10px] px-3 py-1 rounded-full bg-black/35 border border-white/15 text-[#F5F7FF]">
                {project.tags[0]}
              </span>
              <span className="font-mono-label text-[10px] text-[#F5F7FF]/70">
                {project.domain}
              </span>
            </div>

            <div className="relative z-10 my-auto py-4">
              <div className="font-mono-label text-[10px] text-[#F5F7FF]/70 mb-2">
                FEATURED DIGITAL EXPERIENCE · {project.number}
              </div>
              <div className="font-display font-extrabold text-[28px] sm:text-[38px] uppercase text-[#F5F7FF] tracking-tight leading-none">
                {project.name}
              </div>
              <p className="font-body text-[13px] sm:text-[14px] text-[#F5F7FF]/80 mt-2.5 max-w-md line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* Simulated lower fold inside the scrollable preview */}
            <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-white/15">
              {project.tags.map((t) => (
                <div
                  key={t}
                  className="p-2.5 rounded-xl bg-black/25 border border-white/10 font-mono-label text-[9px] text-[#F5F7FF]/85 truncate"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtle bottom inner shadow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 -32px 48px rgba(5, 8, 22, 0.45)',
          }}
        />
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0.33);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const updateScroll = () => {
      rafId = null;
      if (!cardsContainerRef.current) return;
      const cards = cardsContainerRef.current.querySelectorAll('[data-project-index]');
      const viewportCenter = window.innerHeight * 0.48;

      let currentIdx = 0;
      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= viewportCenter) {
          currentIdx = Math.min(idx, PROJECTS_LIST.length - 1);
        }
      });

      setActiveIndex((prev) => (prev !== currentIdx ? currentIdx : prev));
      const nextProgress = ((currentIdx + 1) / PROJECTS_LIST.length) * 100;
      setScrollProgress((prev) => (prev !== nextProgress ? nextProgress : prev));
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Lock body scroll when Case Study modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[140px]"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Top Header + Sticky Project Counter ("01 / 03") & Progress Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 md:mb-16">
          <SectionHeading
            eyebrow="04 / PROJECTS"
            firstLine="SELECTED"
            secondLine="WORK."
            subtitle="Real brands. Real experiences. Built end to end."
          />

          {/* Dynamic Project Counter & Progress Bar */}
          <div className="w-full lg:w-72 p-5 rounded-[24px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl shrink-0">
            <div className="flex items-center justify-between font-mono-label text-[11px] mb-3">
              <span className="text-[#8B93B7]">TOP TRENDING PROJECTS</span>
              <span className="text-[#F5F7FF] font-bold tabular-nums">
                0{activeIndex + 1} <span className="text-[#2F6BFF]">/</span> 0
                {PROJECTS_LIST.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${scrollProgress}%`,
                  background: 'linear-gradient(90deg, #2F6BFF 0%, #7B4DFF 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Sticky Stacked-Cards Showcase on Desktop, Vertically Stacked on Mobile */}
        <div ref={cardsContainerRef} className="flex flex-col gap-10 lg:gap-16">
          {PROJECTS_LIST.map((project, idx) => {
            const stickyTop = 104 + idx * 22;
            return (
              <div
                key={project.name}
                data-project-index={idx}
                style={{ top: `${stickyTop}px` }}
                className="lg:sticky rounded-[40px] bg-[#070C22]/90 border border-[rgba(255,255,255,0.1)] backdrop-blur-2xl shadow-[0_30px_80px_rgba(2,4,14,0.88),inset_0_1px_1px_rgba(255,255,255,0.1)] p-6 sm:p-8 lg:p-10 transition-colors hover:border-[#2F6BFF]/40"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  {/* Left/Main 7 Columns: 16:10 Browser-Frame Mockup */}
                  <div className="lg:col-span-7">
                    <BrowserMockup
                      project={project}
                      onOpenModal={() => setSelectedProject(project)}
                    />
                  </div>

                  {/* Right 5 Columns: Project Details, Tags, Tech Chips & Actions */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      {/* Project Number & Category Mono Pills */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <span className="font-mono-label text-[28px] sm:text-[32px] font-extrabold text-signature-gradient leading-none tabular-nums">
                          {project.number}
                        </span>

                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-[rgba(47,107,255,0.12)] border border-[rgba(47,107,255,0.3)] font-mono-label text-[9.5px] text-[#F5F7FF]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-display font-extrabold text-[24px] sm:text-[30px] uppercase text-[#F5F7FF] tracking-tight leading-tight">
                        {project.name}
                      </h3>

                      {/* 2-Line Description */}
                      <p className="mt-3.5 font-body text-[15px] sm:text-[16px] leading-[1.65] text-[#8B93B7]">
                        {project.description}
                      </p>

                      {/* Tech / Skills Chips */}
                      <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.08)]">
                        <span className="font-mono-label text-[10px] text-[#8B93B7] block mb-2.5">
                          DELIVERED CAPABILITIES
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] font-body text-[12px] text-[#F5F7FF]/85"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Two Buttons: VISIT LIVE SITE + CASE STUDY + */}
                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-hover="true"
                        className="group min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[#2F6BFF] text-[#F5F7FF] border border-[#5B8CFF]/40 shadow-[0_0_26px_rgba(47,107,255,0.45)] hover:bg-[#3B76FF] hover:shadow-[0_0_36px_rgba(47,107,255,0.7)] px-6 py-3 font-mono-label text-[11.5px] font-medium transition-all duration-200"
                      >
                        <span>VISIT LIVE SITE</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        data-cursor-hover="true"
                        className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(255,255,255,0.03)] text-[#F5F7FF] border border-[rgba(255,255,255,0.12)] hover:border-[#2F6BFF]/50 hover:bg-[rgba(47,107,255,0.08)] px-6 py-3 font-mono-label text-[11.5px] font-medium transition-all duration-200 cursor-pointer"
                      >
                        <span>CASE STUDY</span>
                        <Plus className="w-3.5 h-3.5 text-[#2F6BFF]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 4. COMING SOON Card (Dashed Gradient Border, Pulsing IN PROGRESS Green Dot, Blurred Preview) */}
          <div
            style={{ top: '172px' }}
            className="lg:sticky rounded-[40px] bg-[#060A1D]/85 border-2 border-dashed border-[#2F6BFF]/35 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_24px_60px_rgba(2,4,14,0.8)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Blurred Preview Browser Mockup */}
              <div className="lg:col-span-7">
                <div className="relative w-full aspect-[16/10] rounded-[26px] overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#050816] flex flex-col">
                  <div className="h-9 px-4 bg-[#0A1029]/90 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                    <div
                      className="absolute inset-0 scale-110"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 40%, rgba(47, 107, 255, 0.28), transparent 55%), radial-gradient(circle at 70% 65%, rgba(123, 77, 255, 0.25), transparent 55%)',
                        filter: 'blur(26px)',
                      }}
                    />
                    <div className="relative z-10 px-5 py-2.5 rounded-full bg-[#050816]/80 border border-[rgba(255,255,255,0.12)] backdrop-blur-xl flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#F2B84B]" />
                      <span className="font-mono-label text-[11px] text-[#F5F7FF]">
                        CONFIDENTIAL BUILD IN LAB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon Details */}
              <div className="lg:col-span-5 flex flex-col items-start">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#22C55E]/12 border border-[#22C55E]/35 mb-5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
                  </span>
                  <span className="font-mono-label text-[10px] font-semibold text-[#22C55E]">
                    IN PROGRESS
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-[24px] sm:text-[30px] uppercase text-[#F5F7FF] tracking-tight">
                  COMING SOON
                </h3>

                <p className="mt-3 font-body text-[16px] leading-[1.65] text-[#8B93B7]">
                  Another project is on its way.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Button: VIEW FULL PORTFOLIO */}
        <div className="mt-14 md:mt-16 flex justify-center">
          <PillButton
            variant="secondary"
            size="lg"
            href="https://muhammad-mayer-portfolio.vercel.app/"
            onClick={(e) => {
              e.preventDefault();
              const a = document.createElement('a');
              a.href = 'https://muhammad-mayer-portfolio.vercel.app/';
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            VIEW FULL PORTFOLIO
          </PillButton>
        </div>
      </div>

      {/* Smooth Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="case-study-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[80] bg-[#050816]/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-[36px] bg-[#080E26] border border-[rgba(255,255,255,0.14)] shadow-[0_32px_90px_rgba(0,0,0,0.9)] p-6 sm:p-9 my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3">
                  <span className="font-mono-label text-[12px] text-[#2F6BFF] font-bold">
                    CASE STUDY · {selectedProject.number}
                  </span>
                  <span className="text-[#8B93B7]">·</span>
                  <span className="font-mono-label text-[11px] text-[#8B93B7]">
                    {selectedProject.domain}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close Case Study Modal"
                  className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#F5F7FF] hover:border-[#2F6BFF] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Browser Mockup inside Modal */}
              <div className="mt-6">
                <BrowserMockup project={selectedProject} />
              </div>

              {/* Extended Case Study Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <h3 className="font-display font-extrabold text-[24px] sm:text-[28px] uppercase text-[#F5F7FF]">
                      {selectedProject.name}
                    </h3>
                    <p className="font-body text-[15px] text-[#8B93B7] mt-2 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)]">
                    <div className="font-mono-label text-[10px] text-[#2F6BFF] mb-1.5">
                      THE CHALLENGE
                    </div>
                    <p className="font-body text-[14px] text-[#F5F7FF]/90 leading-relaxed">
                      {selectedProject.caseStudy.challenge}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)]">
                    <div className="font-mono-label text-[10px] text-[#22C55E] mb-1.5">
                      ORION ARCHITECTURE &amp; SOLUTION
                    </div>
                    <p className="font-body text-[14px] text-[#F5F7FF]/90 leading-relaxed">
                      {selectedProject.caseStudy.solution}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.08)]">
                  <div>
                    <div className="font-mono-label text-[10px] text-[#F2B84B] mb-4">
                      KEY DELIVERABLES
                    </div>
                    <ul className="space-y-3">
                      {selectedProject.caseStudy.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 font-body text-[13.5px] text-[#F5F7FF]/90 leading-snug"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#2F6BFF] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-[rgba(255,255,255,0.08)]">
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2F6BFF] text-[#F5F7FF] py-3.5 px-6 font-mono-label text-[11.5px] font-medium shadow-[0_0_26px_rgba(47,107,255,0.45)] hover:bg-[#3B76FF] transition-all"
                    >
                      <span>VISIT LIVE SITE</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
