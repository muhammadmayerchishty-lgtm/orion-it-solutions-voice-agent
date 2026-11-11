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
    name: 'DECORIUM ZONE',
    domain: 'decoriumzone.com',
    description:
      'Real client website for a premier interior architecture & bespoke decor studio. Luxury portfolio gallery and client booking funnel.',
    tags: ['Real Client', 'Interior Architecture', 'E-Commerce'],
    skills: ['React & Next.js', 'Spatial UI/UX', 'Custom Catalog', 'SEO Architecture', 'Appointment Booking'],
    link: 'https://www.decoriumzone.com/',
    screenshot: '/images/decorium-zone.webp',
    accentGradient: 'linear-gradient(135deg, #0C1226 0%, #1E2D58 50%, #473212 100%)',
    accentColor: '#F2B84B',
    caseStudy: {
      challenge:
        'Deliver a commercial-grade digital storefront for an interior decor house showcasing bespoke furniture lines, materials, and architectural consultation bookings.',
      solution:
        'Architected a luxury, high-conversion web platform with refined typographic grid layouts, high-res visual galleries, and instant WhatsApp booking integration.',
      highlights: [
        'Live commercial production site running for Decorium Zone',
        'Spatial room monograph & material detail lookbook',
        'Direct inquiry funnel with high conversion rate',
      ],
    },
  },
  {
    number: '02',
    name: 'SHAFIQUE PROPERTIES DHA',
    domain: 'shafique-properties-dha.vercel.app',
    description:
      'High-end real estate portal for premium DHA Lahore commercial & residential properties with interactive listings.',
    tags: ['Real Estate', 'DHA Lahore', 'Property Portal'],
    skills: ['React', 'TypeScript', 'Property Filtering', 'DHA Sector Maps', 'Direct Agent Connect'],
    link: 'https://shafique-properties-dha.vercel.app/',
    screenshot: '/images/shafique-properties-dha.webp',
    accentGradient: 'linear-gradient(135deg, #081020 0%, #182C52 50%, #104080 100%)',
    accentColor: '#2F6BFF',
    caseStudy: {
      challenge:
        'DHA Lahore real estate buyers require verified listing data, high-resolution plot walkthroughs, and fast agent response times.',
      solution:
        'Engineered an authoritative property portal featuring phase-by-phase DHA listing filters, investment ROI calculators, and one-tap consultation booking.',
      highlights: [
        'Comprehensive DHA Lahore property inventory & phase breakdown',
        'Mobile-first inquiry capture routing straight to sales executives',
        'Clean, trustworthy luxury interface built for high-ticket buyers',
      ],
    },
  },
  {
    number: '03',
    name: 'MARWA REAL ESTATE',
    domain: 'marwa-real-estate-orion.vercel.app',
    description:
      'Modern property portfolio & prime real estate agency showcase crafted for investors and luxury homebuyers.',
    tags: ['Real Estate', 'Investment', 'Modern Web'],
    skills: ['Next-Gen Web Design', 'Interactive Catalog', 'Investment Calculator', 'Lead Routing'],
    link: 'https://marwa-real-estate-orion.vercel.app/',
    screenshot: '/images/marwa-real-estate.webp',
    accentGradient: 'linear-gradient(135deg, #06161C 0%, #103440 50%, #124C36 100%)',
    accentColor: '#22C55E',
    caseStudy: {
      challenge:
        'Elevate Marwa Real Estate from traditional property brokers to a modern digital agency attracting overseas investors.',
      solution:
        'Crafted an emerald-accented luxury property monograph highlighting residential towers, commercial plots, and verified developmental timelines.',
      highlights: [
        'Streamlined investor portfolio showcase with yield projections',
        'Fast sub-second page transitions across property tiers',
        'Direct WhatsApp consultation link with pre-filled property IDs',
      ],
    },
  },
  {
    number: '04',
    name: 'ORION IVY REAL ESTATE 3D',
    domain: 'orion-ivy-realestate-3d.vercel.app',
    description:
      'Spatial 3D real estate experience powered by the autonomous Ivy AI Voice Agent for real-time client calls.',
    tags: ['3D WebGL', 'Ivy AI Voice Agent', 'Luxury Estates'],
    skills: ['Three.js & WebGL', 'Vapi AI Voice Integration', 'Spatial 3D Model', 'Real-Time Telephony'],
    link: 'https://orion-ivy-realestate-3d.vercel.app/',
    screenshot: '/images/orion-ivy-realestate-3d.webp',
    accentGradient: 'linear-gradient(135deg, #120A28 0%, #2C1A58 50%, #4D1878 100%)',
    accentColor: '#7B4DFF',
    caseStudy: {
      challenge:
        'Eliminate manual lead intake delays by pairing an interactive 3D architectural viewer with an AI agent capable of answering voice inquiries in real time.',
      solution:
        'Integrated Three.js architectural rendering with Ivy AI — an autonomous voice agent that speaks naturally, qualifies buyers, and schedules private viewings 24/7.',
      highlights: [
        'Interactive 3D building exploration with smooth orbit controls',
        'Live autonomous Ivy AI Voice Assistant answering calls on site',
        'Instant client budget qualification and calendar sync',
      ],
    },
  },
  {
    number: '05',
    name: 'LIVI DEVELOPERS',
    domain: 'livi-developers-sm8p.vercel.app',
    description:
      'Architectural developer portal featuring masterplan visualizers and the autonomous Livi AI Voice Agent.',
    tags: ['Property Developer', 'Livi AI Voice Agent', 'Architecture'],
    skills: ['Developer Portal', 'AI Calling Agent', 'Masterplan Visualizer', 'Enterprise Lead Pipeline'],
    link: 'https://livi-developers-sm8p.vercel.app/',
    screenshot: '/images/livi-developers.webp',
    accentGradient: 'linear-gradient(135deg, #0A1826 0%, #1A3C58 50%, #154D38 100%)',
    accentColor: '#22C55E',
    caseStudy: {
      challenge:
        'Large-scale property developers receive hundreds of repetitive investor inquiries across time zones that overwhelm human receptionists.',
      solution:
        'Deployed Livi Developers web hub with Livi AI voice agent embedded directly into the frontend, taking calls, explaining floor plans, and sending summaries.',
      highlights: [
        '24/7 autonomous Livi AI voice receptionist handling buyer queries',
        'Interactive floor plans and developmental milestone trackers',
        'Automatic email and WhatsApp lead dispatch with call transcripts',
      ],
    },
  },
  {
    number: '06',
    name: 'LIVA LUXURY CLOTHING STORE',
    domain: 'liva-luxury-clothing-store.vercel.app',
    description:
      'High-fashion digital atelier & luxury e-commerce experience with tactile product storytelling and smooth animations.',
    tags: ['Fashion & Apparel', 'Luxury E-Commerce', 'Editorial UI/UX'],
    skills: ['Haute Couture Editorial', 'Micro-Interactions', 'Smooth Checkout Flow', 'Lookbook Gallery'],
    link: 'https://liva-luxury-clothing-store.vercel.app/',
    screenshot: '/images/liva-luxury-clothing.webp',
    accentGradient: 'linear-gradient(135deg, #1C0A16 0%, #421832 50%, #582424 100%)',
    accentColor: '#F2B84B',
    caseStudy: {
      challenge:
        'Capture the tactile elegance of high-end fabrics and bespoke tailoring in a digital storefront that rivals European luxury houses.',
      solution:
        'Designed an editorial lookbook storefront with smooth image pan choreography, fabric detail zoom, and frictionless bespoke sizing guides.',
      highlights: [
        'Editorial runway lookbook with atmospheric typography',
        'Sensory product cards with fluid hover transitions',
        'Conversion-optimized mobile shopping experience',
      ],
    },
  },
  {
    number: '07',
    name: 'EMPIRE CORE',
    domain: 'empire-core-z1bq.vercel.app',
    description:
      'Futuristic urban footwear and performance sneaker experience engineered with dynamic dark aesthetics.',
    tags: ['Streetwear', 'Footwear E-Commerce', 'Dark Theme'],
    skills: ['Urban Streetwear UI', 'Dynamic Product Lab', '360 Sneaker Spin', 'Next-Gen Motion'],
    link: 'https://empire-core-z1bq.vercel.app/',
    screenshot: '/images/empire-core.webp',
    accentGradient: 'linear-gradient(135deg, #0E0E14 0%, #262634 50%, #1A3258 100%)',
    accentColor: '#2F6BFF',
    caseStudy: {
      challenge:
        'Create a bold, high-octane sneaker drop site that energizes Gen-Z streetwear enthusiasts and collectors.',
      solution:
        'Engineered an industrial obsidian interface featuring limited-edition drop countdowns, dynamic sneaker spec breakdowns, and rapid cart checkout.',
      highlights: [
        'High-energy urban dark aesthetic with neon blue accents',
        'Interactive sneaker specification and material breakdown',
        'Sub-second cart and checkout journey built for drops',
      ],
    },
  },
  {
    number: '08',
    name: 'SAFA 3D EXPERIENCE',
    domain: 'safa-3d-experience.vercel.app',
    description:
      'Luxury Haute Parfumerie website featuring real-time 3D interactive flacon bottles and olfactory note notes.',
    tags: ['Haute Parfumerie', '3D WebGL', 'Luxury Brand'],
    skills: ['Three.js Flacon Glass', 'Olfactory Pyramids', 'Sensory Motion', 'VIP Order Funnel'],
    link: 'https://safa-3d-experience.vercel.app/',
    screenshot: '/images/safa-3d-experience.webp',
    accentGradient: 'linear-gradient(135deg, #1A140A 0%, #443216 50%, #5A2A14 100%)',
    accentColor: '#F2B84B',
    caseStudy: {
      challenge:
        'Translate the intangible luxury of niche perfumery and precious oud oils into an immersive 3D digital art piece.',
      solution:
        'Created a WebGL flacon showcase with interactive glass refraction, dynamic scent pyramid breakdowns, and private VIP sample order routing.',
      highlights: [
        'Real-time 3D glass perfume bottle with reflection & caustics',
        'Interactive top, heart, and base olfactory note visualizer',
        'Prestigious Middle Eastern luxury aesthetic tailored for UAE clients',
      ],
    },
  },
  {
    number: '09',
    name: 'VERITAS SMARTWATCH',
    domain: 'veritas-smartwatch.vercel.app',
    description:
      'Next-generation wearable technology website showcasing biometric sensors and hardware engineering.',
    tags: ['Wearable Tech', 'Hardware Showcase', 'Apple Aesthetic'],
    skills: ['Precision Hardware UI', 'Interactive Sensor Demos', 'Titanium Casing 3D', 'Tech Specs Grid'],
    link: 'https://veritas-smartwatch.vercel.app/',
    screenshot: '/images/veritas-smartwatch.webp',
    accentGradient: 'linear-gradient(135deg, #081624 0%, #163858 50%, #244670 100%)',
    accentColor: '#2F6BFF',
    caseStudy: {
      challenge:
        'Present cutting-edge smartwatch hardware and biometric health software with Apple-caliber precision and clarity.',
      solution:
        'Built a cinematic hardware product page with micro-interaction sensor demos, battery life comparisons, and responsive spec tables.',
      highlights: [
        'Apple-level precision typography and dark titanium aesthetic',
        'Interactive health sensor metrics and display modes',
        'Global pre-order and reservation pipeline with zero friction',
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
