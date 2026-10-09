import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Braces,
  GitBranch,
  MessageCircle,
  Mail,
  CheckCircle2,
  Terminal,
  Laptop,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { GlassCard } from '../components/GlassCard';
import { PillButton } from '../components/PillButton';
import { SafeImage } from '../components/SafeImage';
import { useSmoothScroll } from '../components/SmoothScrollProvider';

interface FlowNodeData {
  id: string;
  stepNumber: string;
  title: string;
  caption: string;
  tooltip: string;
  color: string;
  glow: string;
  x: number;
  y: number;
  iconType: 'json' | 'router' | 'whatsapp' | 'email';
}

const FLOW_NODES: FlowNodeData[] = [
  {
    id: 'call-received',
    stepNumber: '01',
    title: 'CALL RECEIVED',
    caption: 'ElevenLabs Voice Agent',
    tooltip:
      'Conversational AI receptionist answers incoming calls 24/7, speaks naturally, and records the caller enquiry.',
    color: '#9333EA',
    glow: 'rgba(147, 51, 234, 0.55)',
    x: 95,
    y: 170,
    iconType: 'json',
  },
  {
    id: 'parse-json',
    stepNumber: '02',
    title: 'PARSE JSON',
    caption: 'Structured lead data',
    tooltip:
      'Extracts structured JSON fields: customer_name, contact_number, urgency_status, appointment_time, and transcript.',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.55)',
    x: 285,
    y: 170,
    iconType: 'json',
  },
  {
    id: 'router',
    stepNumber: '03',
    title: 'ROUTER',
    caption: 'Smart routing',
    tooltip:
      'Make.com router splits the validated lead payload simultaneously into instant WhatsApp and Gmail alert branches.',
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.6)',
    x: 475,
    y: 170,
    iconType: 'router',
  },
  {
    id: 'whatsapp',
    stepNumber: '04',
    title: 'WHATSAPP',
    caption: 'WhatsApp Business Cloud: Send a Message',
    tooltip:
      'Dispatches an instant formatted lead notification directly to WhatsApp Business Cloud.',
    color: '#25D366',
    glow: 'rgba(37, 211, 102, 0.6)',
    x: 695,
    y: 92,
    iconType: 'whatsapp',
  },
  {
    id: 'email',
    stepNumber: '05',
    title: 'EMAIL',
    caption: 'Gmail: Send an email',
    tooltip:
      'Sends a structured executive email summary and call transcript via Gmail.',
    color: '#EA4335',
    glow: 'rgba(234, 67, 53, 0.6)',
    x: 695,
    y: 248,
    iconType: 'email',
  },
];

const AI_FEATURE_CHIPS = [
  '24/7 Voice Answering',
  'Lead Qualification',
  'Instant WhatsApp Alert',
  'Email Summary',
  'Appointment Capture',
  'Zero-Touch Workflow',
];

const SAMPLE_JSON_LINES = [
  '{',
  '  "customer_name": "Tariq Mahmood",',
  '  "contact_number": "+92 300 1234567",',
  '  "urgency_status": "HIGH_PRIORITY",',
  '  "appointment_time": "Tomorrow, 04:00 PM PKT",',
  '  "transcript": "I need a consultation for a business website.",',
  '  "source": "ElevenLabs"',
  '}',
];

function LiveJsonLeadCard() {
  const fullText = SAMPLE_JSON_LINES.join('\n');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCharCount(fullText.length);
      return;
    }

    let timeoutId: number;
    const tick = () => {
      setCharCount((prev) => {
        if (prev >= fullText.length) {
          timeoutId = window.setTimeout(() => {
            setCharCount(0);
          }, 3200);
          return prev;
        }
        return prev + 2;
      });
    };

    const intervalId = window.setInterval(tick, 32);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [fullText]);

  const displayedText = fullText.slice(0, charCount);

  return (
    <GlassCard className="p-6 sm:p-7 border-[#22C55E]/30 h-full flex flex-col justify-between">
      <div>
        {/* Card Header with SAMPLE DATA badge */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
            <span className="font-mono-label text-[11px] font-semibold text-[#F5F7FF]">
              LIVE LEAD PAYLOAD
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 font-mono-label text-[9.5px] font-semibold text-[#22C55E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            SAMPLE DATA
          </span>
        </div>

        {/* Typed JSON Payload Terminal */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#040713]/95 border border-[rgba(34,197,94,0.22)] font-mono text-[12px] sm:text-[12.5px] leading-[1.7] text-[#F5F7FF] overflow-x-auto min-h-[212px]">
          <pre className="m-0 whitespace-pre-wrap break-words">
            <code>
              {displayedText}
              <span className="inline-block w-2 h-4 align-middle bg-[#22C55E] ml-0.5 animate-pulse" />
            </code>
          </pre>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between font-mono-label text-[10px] text-[#8B93B7]">
        <span>WEBHOOK STATUS: 200 OK</span>
        <span className="text-[#22C55E]">ROUTED TO WHATSAPP &amp; GMAIL</span>
      </div>
    </GlassCard>
  );
}

export function AiSection() {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [makeImgFailed, setMakeImgFailed] = useState(false);
  const { scrollTo } = useSmoothScroll();

  const activeNode = FLOW_NODES.find((n) => n.id === hoveredNodeId) || null;

  const handleBookDemo = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    scrollTo('#contact', -20);
  };

  return (
    <section id="ai" className="relative z-10 py-[120px] md:py-[140px]">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section Headline */}
        <div className="mb-14 md:mb-16">
          <SectionHeading
            eyebrow="05 / FLAGSHIP AI"
            firstLine="AUTOMATION THAT"
            secondLine="NEVER SLEEPS."
            accentColor="ai"
            subtitle="An AI voice receptionist answers every enquiry, captures the details and notifies you instantly on WhatsApp and Email."
          />
        </div>

        {/* Interactive Make.com-Inspired Node-Flow Diagram */}
        <GlassCard
          interactive={false}
          className="p-6 sm:p-8 lg:p-10 border-[#22C55E]/35 shadow-[0_0_50px_rgba(34,197,94,0.1)]"
        >
          {/* Top Canvas Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
              </span>
              <span className="font-mono-label text-[11px] sm:text-[12px] font-semibold text-[#F5F7FF]">
                ACTIVE SCENARIO · AI VOICE RECEPTIONIST TO WHATSAPP &amp; GMAIL
              </span>
            </div>

            <span className="font-mono-label text-[10px] text-[#22C55E] px-3 py-1 rounded-full bg-[#22C55E]/12 border border-[#22C55E]/35">
              HOVER ANY NODE TO INSPECT STEP
            </span>
          </div>

          {/* Pure SVG + Framer Motion Node-Flow Canvas */}
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[680px] w-full">
              <svg
                viewBox="0 0 820 340"
                className="w-full h-auto select-none overflow-visible"
                role="img"
                aria-label="Make.com AI automation scenario diagram: Call Received to Parse JSON to Router splitting into WhatsApp and Email"
              >
                <defs>
                  {/* Subtle Make.com canvas dot grid */}
                  <pattern
                    id="makeDotGrid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.08)" />
                  </pattern>

                  <linearGradient id="linePurpleToPurple" x1="95" y1="170" x2="285" y2="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#9333EA" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>

                  <linearGradient id="linePurpleToGreen" x1="285" y1="170" x2="475" y2="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>

                  <linearGradient id="lineRouterToWhatsApp" x1="475" y1="170" x2="695" y2="92" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#25D366" />
                  </linearGradient>

                  <linearGradient id="lineRouterToEmail" x1="475" y1="170" x2="695" y2="248" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#EA4335" />
                  </linearGradient>

                  <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Canvas background dot matrix */}
                <rect
                  x="0"
                  y="0"
                  width="820"
                  height="340"
                  rx="24"
                  fill="rgba(4, 7, 19, 0.75)"
                />
                <rect
                  x="0"
                  y="0"
                  width="820"
                  height="340"
                  rx="24"
                  fill="url(#makeDotGrid)"
                />

                {/* CONNECTOR PATHS (Dotted Make.com pipes + Travelling Pulses) */}
                {/* Path 1: Node 1 (95,170) -> Node 2 (285,170) */}
                <line
                  x1="95"
                  y1="170"
                  x2="285"
                  y2="170"
                  stroke="url(#linePurpleToPurple)"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeOpacity="0.65"
                />
                <motion.circle
                  r="5.5"
                  fill="#C084FC"
                  filter="url(#pulseGlow)"
                  animate={{ cx: [95, 285], cy: [170, 170], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Path 2: Node 2 (285,170) -> Node 3 (475,170) */}
                <line
                  x1="285"
                  y1="170"
                  x2="475"
                  y2="170"
                  stroke="url(#linePurpleToGreen)"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeOpacity="0.65"
                />
                <motion.circle
                  r="5.5"
                  fill="#22C55E"
                  filter="url(#pulseGlow)"
                  animate={{ cx: [285, 475], cy: [170, 170], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.8,
                    delay: 0.6,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Path 3 (Branch 1): Router (475,170) -> WhatsApp (695,92) */}
                <path
                  d="M 475 170 C 565 170, 595 92, 695 92"
                  fill="none"
                  stroke="url(#lineRouterToWhatsApp)"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeOpacity="0.75"
                />
                <motion.circle
                  r="5.5"
                  fill="#25D366"
                  filter="url(#pulseGlow)"
                  animate={{
                    cx: [475, 545, 615, 695],
                    cy: [170, 155, 106, 92],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Path 4 (Branch 2): Router (475,170) -> Email (695,248) */}
                <path
                  d="M 475 170 C 565 170, 595 248, 695 248"
                  fill="none"
                  stroke="url(#lineRouterToEmail)"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  strokeOpacity="0.75"
                />
                <motion.circle
                  r="5.5"
                  fill="#EA4335"
                  filter="url(#pulseGlow)"
                  animate={{
                    cx: [475, 545, 615, 695],
                    cy: [170, 185, 234, 248],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 1.35,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Branch Order Badges ("1st", "2nd") */}
                <g transform="translate(576, 114)">
                  <rect
                    x="-18"
                    y="-10"
                    width="36"
                    height="20"
                    rx="10"
                    fill="#071318"
                    stroke="#22C55E"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#22C55E"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    1ST
                  </text>
                </g>

                <g transform="translate(576, 226)">
                  <rect
                    x="-18"
                    y="-10"
                    width="36"
                    height="20"
                    rx="10"
                    fill="#180A0D"
                    stroke="#EA4335"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#EA4335"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    2ND
                  </text>
                </g>

                {/* 5 CIRCULAR GLOWING NODES */}
                {FLOW_NODES.map((node) => {
                  const isHovered = hoveredNodeId === node.id;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onClick={() =>
                        setHoveredNodeId((prev) => (prev === node.id ? null : node.id))
                      }
                      className="cursor-pointer"
                    >
                      {/* Outer Ambient Halo */}
                      <circle
                        r={isHovered ? 50 : 42}
                        fill={node.color}
                        fillOpacity={isHovered ? 0.28 : 0.14}
                        style={{ transition: 'all 0.25s ease' }}
                      />

                      {/* Circular Node Shell */}
                      <circle
                        r={isHovered ? 36 : 32}
                        fill="#0A1026"
                        stroke={node.color}
                        strokeWidth={isHovered ? 3 : 2.2}
                        style={{ transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />

                      {/* Colored Inner Core */}
                      <circle
                        r={isHovered ? 26 : 23}
                        fill={node.color}
                        fillOpacity="0.22"
                        style={{ transition: 'all 0.25s ease' }}
                      />

                      {/* Node Vector Icon */}
                      {node.iconType === 'json' && (
                        <text
                          x="0"
                          y="6"
                          textAnchor="middle"
                          fill="#F5F7FF"
                          fontSize="17"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="700"
                        >
                          {'{ }'}
                        </text>
                      )}

                      {node.iconType === 'router' && (
                        <g
                          stroke="#22C55E"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        >
                          <path d="M-9 0 H2 M2 0 L8 -7 M2 0 L8 7" />
                          <polyline points="5 -8 9 -7 8 -3" />
                          <polyline points="5 8 9 7 8 3" />
                        </g>
                      )}

                      {node.iconType === 'whatsapp' && (
                        <path
                          transform="translate(-10, -10) scale(0.85)"
                          fill="#25D366"
                          d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.156-1.359c1.484.813 3.172 1.25 4.875 1.25 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2z"
                        />
                      )}

                      {node.iconType === 'email' && (
                        <g
                          stroke="#EA4335"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        >
                          <rect x="-10" y="-7" width="20" height="14" rx="2.5" />
                          <path d="M-9 -6 L0 1 L9 -6" />
                        </g>
                      )}

                      {/* Step Badge on Top-Right of Node */}
                      <g transform="translate(22, -22)">
                        <circle r="10" fill="#050816" stroke={node.color} strokeWidth="1.5" />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#F5F7FF"
                          fontSize="8.5"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="700"
                        >
                          {node.stepNumber}
                        </text>
                      </g>

                      {/* Node Title & Caption */}
                      <text
                        x="0"
                        y="54"
                        textAnchor="middle"
                        fill="#F5F7FF"
                        fontSize="11"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="700"
                        letterSpacing="0.08em"
                      >
                        {node.title}
                      </text>
                      <text
                        x="0"
                        y="70"
                        textAnchor="middle"
                        fill="#8B93B7"
                        fontSize="10"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {node.caption}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Node Tooltip Inspection Bar */}
          <div className="mt-5 min-h-[54px] p-4 rounded-2xl bg-[#050816]/85 border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-4">
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-wrap items-center gap-3 text-[13.5px]"
                >
                  <span
                    className="px-2.5 py-0.5 rounded-full font-mono-label text-[10px] font-bold text-[#F5F7FF]"
                    style={{ backgroundColor: activeNode.color }}
                  >
                    NODE {activeNode.stepNumber} · {activeNode.title}
                  </span>
                  <span className="font-body text-[#F5F7FF]/90">{activeNode.tooltip}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5 font-body text-[13.5px] text-[#8B93B7]"
                >
                  <Sparkles className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>
                    Hover or tap any node above to inspect how voice calls are parsed and routed in
                    real time.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Below Diagram: Live JSON Lead Card + Make.com Proof Laptop Frame */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 6 Columns: Live JSON Lead Card */}
          <div className="lg:col-span-6">
            <LiveJsonLeadCard />
          </div>

          {/* Right 6 Columns: Make.com Proof Inside Browser/Laptop Frame with Hover Zoom */}
          <div className="lg:col-span-6">
            <GlassCard className="p-6 sm:p-7 border-[#22C55E]/30 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[rgba(255,255,255,0.08)]">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
                    <span className="font-mono-label text-[11px] font-semibold text-[#F5F7FF]">
                      PRODUCTION SCENARIO PROOF
                    </span>
                  </div>
                  <span className="font-mono-label text-[10px] text-[#22C55E]">
                    BUILT WITH MAKE.COM
                  </span>
                </div>

                {/* Browser / Laptop Mockup Frame with Hover Zoom */}
                <div className="group/make relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#060919] aspect-[16/9]">
                  {/* Laptop Top Bar */}
                  <div className="h-7 px-3 bg-[#0B1026] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                      <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="font-mono-label text-[9px] text-[#8B93B7] lowercase">
                      eu2.make.com/orion-ai-voice-pipeline
                    </span>
                    <span className="w-6" />
                  </div>

                  <div className="relative w-full h-[calc(100%-1.75rem)] overflow-hidden">
                    {!makeImgFailed ? (
                      <SafeImage
                        src="/images/automation-make.webp"
                        alt="Built with Make.com — ORION AI Voice Receptionist Scenario"
                        width={640}
                        height={360}
                        onError={() => setMakeImgFailed(true)}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/make:scale-110"
                      />
                    ) : (
                      /* Resilient Make.com Scenario Visual Canvas with Hover Zoom */
                      <div className="w-full h-full bg-gradient-to-br from-[#140D2B] via-[#0B1528] to-[#071F18] flex flex-col items-center justify-center p-6 transition-transform duration-700 ease-out group-hover/make:scale-110 relative">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="w-12 h-12 rounded-full bg-[#9333EA]/25 border-2 border-[#9333EA] flex items-center justify-center text-[#F5F7FF] shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                            <Braces className="w-5 h-5" />
                          </div>
                          <div className="w-8 h-0.5 border-t-2 border-dashed border-[#A855F7]" />
                          <div className="w-12 h-12 rounded-full bg-[#A855F7]/25 border-2 border-[#A855F7] flex items-center justify-center text-[#F5F7FF] shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                            <Braces className="w-5 h-5" />
                          </div>
                          <div className="w-8 h-0.5 border-t-2 border-dashed border-[#22C55E]" />
                          <div className="w-12 h-12 rounded-full bg-[#22C55E]/25 border-2 border-[#22C55E] flex items-center justify-center text-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                            <GitBranch className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#25D366]/25 border-2 border-[#25D366] flex items-center justify-center text-[#25D366]">
                              <MessageCircle className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#EA4335]/25 border-2 border-[#EA4335] flex items-center justify-center text-[#EA4335]">
                              <Mail className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <span className="mt-4 font-mono-label text-[10px] text-[#F5F7FF]/85 px-3 py-1 rounded-full bg-black/40 border border-white/10">
                          Built with Make.com · ElevenLabs + WhatsApp + Gmail
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between font-mono-label text-[10px] text-[#8B93B7]">
                <span>VERIFIED WORKFLOW ARCHITECTURE</span>
                <span className="text-[#22C55E]">hover to zoom</span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 6 Feature Chips (AI Green Accent) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {AI_FEATURE_CHIPS.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/35 font-mono-label text-[11px] text-[#F5F7FF] shadow-[0_0_20px_rgba(34,197,94,0.12)]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" aria-hidden="true" />
              {chip}
            </span>
          ))}
        </div>

        {/* Section Bottom CTA */}
        <div className="mt-12 orion-glass-card p-8 md:p-10 border-[#22C55E]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_0_45px_rgba(34,197,94,0.12)]">
          <div>
            <span className="font-mono-label text-[10px] text-[#22C55E] block mb-2">
              ZERO-TOUCH LEAD CAPTURE
            </span>
            <h3 className="font-display font-bold text-[20px] sm:text-[24px] uppercase text-[#F5F7FF] tracking-tight">
              WANT THIS FOR YOUR BUSINESS?
            </h3>
            <p className="font-body text-[14px] sm:text-[15px] text-[#8B93B7] mt-1">
              Deploy a 24/7 AI voice receptionist that qualifies callers and sends instant WhatsApp
              &amp; Email summaries.
            </p>
          </div>

          <PillButton
            variant="primary"
            size="lg"
            href="#contact"
            onClick={handleBookDemo}
            className="!bg-[#22C55E] !text-[#050816] !border-[#4ADE80] !shadow-[0_0_28px_rgba(34,197,94,0.5)] hover:!bg-[#34D399]"
          >
            BOOK AN AI DEMO
          </PillButton>
        </div>
      </div>
    </section>
  );
}
