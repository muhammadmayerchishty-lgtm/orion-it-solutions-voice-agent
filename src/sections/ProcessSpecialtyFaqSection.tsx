import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Layers, Sparkles, Plus, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../components/SectionHeading';
import { GlassCard } from '../components/GlassCard';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'We learn your brand, audience and goals.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'UI/UX, brand look and interactive prototypes.',
  },
  {
    number: '03',
    title: 'Develop',
    description: 'Fast, responsive build with 3D and motion.',
  },
  {
    number: '04',
    title: 'Launch & Automate',
    description: 'Go live with AI enquiry handling and support.',
  },
];

const SPECIALTY_FEATURES = [
  {
    title: 'Immersive Project Showcases',
    description: 'Full-screen spatial galleries engineered to honour architectural photography and material detail.',
    icon: Building2,
  },
  {
    title: 'Interactive Digital Portfolios',
    description: 'Smooth-scroll monographs and filterable typologies that elevate your studio presentation.',
    icon: Layers,
  },
  {
    title: 'AI-Powered Enquiry Experience',
    description: 'Instant 24/7 voice and WhatsApp consultation capture so no high-value client brief is missed.',
    icon: Sparkles,
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What does ORION IT SOLUTIONS do?',
    answer:
      'ORION IT SOLUTIONS is a founder-led digital studio in Lahore, Pakistan crafting premium websites, UI/UX interfaces, brand identities, digital portfolios, and AI-powered automation & voice enquiry systems for modern businesses.',
  },
  {
    question: 'Do you work with clients outside Lahore or Pakistan?',
    answer:
      'Yes, available for freelance and remote projects. We collaborate seamlessly with clients and studios globally through structured digital workflows and direct communication.',
  },
  {
    question: 'Can you build a website for my architecture or interior design firm?',
    answer:
      'Yes — architecture and interior design websites are one of our core specialities. We design cinematic project showcases, interactive digital portfolios, and tailored enquiry flows that reflect the spatial quality of your firm.',
  },
  {
    question: 'What is an AI voice agent and how can it help my business?',
    answer:
      'An AI voice agent is a 24/7 virtual receptionist that answers incoming phone calls naturally, captures caller details and project requirements, and routes structured lead summaries directly to your WhatsApp and Email.',
  },
  {
    question: 'How long does a website take?',
    answer:
      'Typically 1 to 3 weeks depending on scope, number of custom pages, 3D/interactive features, and AI automation integrations.',
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'Click Book Appointment to chat on WhatsApp, or use the quick booking form in the Contact section below to send your project details directly to our WhatsApp.',
  },
];

export function ProcessSpecialtyFaqSection() {
  const processContainerRef = useRef<HTMLDivElement>(null);
  const desktopLineFillRef = useRef<HTMLDivElement>(null);
  const mobileLineFillRef = useRef<HTMLDivElement>(null);
  const [reachedStep, setReachedStep] = useState<number>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const el = processContainerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReachedStep(4);
      if (desktopLineFillRef.current) desktopLineFillRef.current.style.width = '100%';
      if (mobileLineFillRef.current) mobileLineFillRef.current.style.height = '100%';
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',
        end: 'bottom 42%',
        scrub: 0.4,
        onUpdate: (self) => {
          const pct = Math.min(1, Math.max(0, self.progress));
          if (desktopLineFillRef.current) {
            desktopLineFillRef.current.style.width = `${(pct * 100).toFixed(1)}%`;
          }
          if (mobileLineFillRef.current) {
            mobileLineFillRef.current.style.height = `${(pct * 100).toFixed(1)}%`;
          }
          const activeCount = Math.max(1, Math.min(4, Math.ceil(pct * 4)));
          setReachedStep((prev) => (prev !== activeCount ? activeCount : prev));
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative z-10">
      {/* BLOCK A: HOW WE WORK (#process) */}
      <section id="process" className="py-[120px] md:py-[140px]">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="mb-14 md:mb-20">
            <SectionHeading
              eyebrow="06 / PROCESS"
              firstLine="FROM IDEA TO"
              secondLine="ORBIT."
            />
          </div>

          <div ref={processContainerRef} className="relative">
            {/* Desktop Horizontal Glowing Line */}
            <div
              className="hidden lg:block absolute top-[28px] left-[8%] right-[8%] h-[2px] bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                ref={desktopLineFillRef}
                className="h-full w-0 rounded-full shadow-[0_0_20px_#F2B84B]"
                style={{
                  background: 'linear-gradient(90deg, #2F6BFF 0%, #7B4DFF 50%, #F2B84B 100%)',
                }}
              />
            </div>

            {/* Mobile Vertical Glowing Line */}
            <div
              className="lg:hidden absolute top-6 bottom-6 left-[27px] w-[2px] bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                ref={mobileLineFillRef}
                className="w-full h-0 rounded-full shadow-[0_0_20px_#F2B84B]"
                style={{
                  background: 'linear-gradient(180deg, #2F6BFF 0%, #7B4DFF 50%, #F2B84B 100%)',
                }}
              />
            </div>

            {/* 4 Steps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
              {PROCESS_STEPS.map((step, index) => {
                const isLit = index < reachedStep;
                return (
                  <div
                    key={step.number}
                    className="relative flex lg:flex-col items-start gap-5 lg:gap-6"
                  >
                    {/* Star Node that lights up gold when reached */}
                    <div className="relative z-10 lg:mx-auto shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isLit
                            ? 'bg-[#0C122B] border-[#F2B84B] shadow-[0_0_28px_rgba(242,184,75,0.55)] scale-105'
                            : 'bg-[#060A1C] border-[rgba(255,255,255,0.12)]'
                        }`}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill={isLit ? '#F2B84B' : 'none'}
                          stroke={isLit ? '#F2B84B' : '#8B93B7'}
                          strokeWidth="1.8"
                          className="transition-all duration-500"
                          aria-hidden="true"
                        >
                          <path d="M12 2L14.8 8.8L22 9.6L16.6 14.4L18.2 21.5L12 17.8L5.8 21.5L7.4 14.4L2 9.6L9.2 8.8L12 2Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Step Card */}
                    <GlassCard
                      className={`flex-1 w-full p-6 sm:p-7 lg:text-center transition-colors duration-500 ${
                        isLit ? 'border-[#F2B84B]/35' : ''
                      }`}
                    >
                      <span
                        className={`font-mono-label text-[11px] font-bold block mb-2 ${
                          isLit ? 'text-[#F2B84B]' : 'text-[#2F6BFF]'
                        }`}
                      >
                        STEP {step.number}
                      </span>
                      <h3 className="font-display font-bold text-[18px] sm:text-[20px] uppercase text-[#F5F7FF] tracking-tight mb-2.5">
                        {step.title}
                      </h3>
                      <p className="font-body text-[14.5px] leading-[1.6] text-[#8B93B7]">
                        {step.description}
                      </p>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK B: ARCHITECTURE & INTERIOR SPECIALITY */}
      <section className="py-[60px] md:py-[80px]">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="relative rounded-[40px] overflow-hidden border border-[rgba(242,184,75,0.35)] bg-[#070C21]/90 shadow-[0_32px_90px_rgba(2,4,14,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] p-8 sm:p-12 lg:p-16">
            {/* Gradient Mesh Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-85"
              style={{
                background:
                  'radial-gradient(circle at 15% 20%, rgba(47, 107, 255, 0.22) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(242, 184, 75, 0.16) 0%, transparent 48%), radial-gradient(circle at 55% 85%, rgba(123, 77, 255, 0.20) 0%, transparent 55%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F2B84B]/12 border border-[#F2B84B]/35 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#F2B84B] shadow-[0_0_8px_#F2B84B]" />
                <span className="font-mono-label text-[10px] sm:text-[11px] font-semibold text-[#F2B84B]">
                  ARCHITECTURE &amp; INTERIOR SPECIALITY
                </span>
              </div>

              <h2
                className="font-display font-extrabold text-[26px] sm:text-[36px] lg:text-[44px] uppercase text-[#F5F7FF] tracking-[-0.02em] leading-[1.1] max-w-4xl"
                style={{ textWrap: 'balance' }}
              >
                BUILT FOR ARCHITECTS &amp;{' '}
                <span className="italic text-signature-gradient pr-2">
                  INTERIOR DESIGNERS.
                </span>
              </h2>

              <p className="mt-5 font-body text-[16px] md:text-[18px] leading-[1.68] text-[#8B93B7] max-w-3xl">
                Your projects deserve more than a gallery grid. We build cinematic project
                showcases, interactive portfolios and AI-powered enquiry experiences that turn
                visitors into clients.
              </p>

              {/* Three Feature Mini-Cards */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                {SPECIALTY_FEATURES.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.title}
                      className="p-6 rounded-[24px] bg-[#050816]/75 border border-[rgba(255,255,255,0.1)] hover:border-[#F2B84B]/45 transition-colors backdrop-blur-xl"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#F2B84B]/15 border border-[#F2B84B]/35 flex items-center justify-center text-[#F2B84B] mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-body font-bold text-[17px] text-[#F5F7FF] mb-2">
                        {feat.title}
                      </h3>
                      <p className="font-body text-[13.5px] leading-[1.6] text-[#8B93B7]">
                        {feat.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Button: SEE ARC STUDIO DEMO */}
              <div className="mt-10">
                <a
                  href="https://arc-studio-websitem-ndkv.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover="true"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#2F6BFF] text-[#F5F7FF] border border-[#6895FF]/40 shadow-[0_0_28px_rgba(47,107,255,0.5)] hover:bg-[#3B76FF] hover:shadow-[0_0_38px_rgba(47,107,255,0.75)] px-7 py-3.5 font-mono-label text-[12px] font-medium transition-all duration-200"
                >
                  <span>SEE ARC STUDIO DEMO</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK C: FAQ ACCORDION */}
      <section className="py-[100px] md:py-[120px]">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="FREQUENTLY ASKED QUESTIONS"
                firstLine="CLEAR"
                secondLine="ANSWERS."
                subtitle="Everything you need to know about working with ORION IT SOLUTIONS."
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.question}
                    className={`rounded-[26px] border transition-colors duration-200 overflow-hidden backdrop-blur-xl ${
                      isOpen
                        ? 'bg-[rgba(47,107,255,0.08)] border-[#2F6BFF]/45 shadow-[0_0_32px_rgba(47,107,255,0.12)]'
                        : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      data-cursor-hover="true"
                      className="w-full px-6 py-5 sm:px-7 sm:py-6 flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <span className="font-body font-semibold text-[16px] sm:text-[17px] text-[#F5F7FF] leading-snug">
                        {item.question}
                      </span>
                      <span
                        className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#2F6BFF] border-[#2F6BFF] text-[#F5F7FF] rotate-45'
                            : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)] text-[#8B93B7]'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 font-body text-[15px] leading-[1.7] text-[#8B93B7] border-t border-[rgba(255,255,255,0.06)]">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
