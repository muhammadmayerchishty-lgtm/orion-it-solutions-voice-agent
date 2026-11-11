import { useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Bot,
  Cpu,
  Crown,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';

interface PricingTier {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  pkr: string;
  aed: string;
  flagship?: boolean;
  accent: 'blue' | 'purple' | 'green' | 'gold';
  icon: typeof Layers;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'digital-presence',
    number: '01',
    name: 'ORION Digital Presence',
    subtitle: 'Foundation Website & Visual Identity',
    pkr: 'PKR 55,000',
    aed: 'AED 1,500',
    accent: 'blue',
    icon: Layers,
    features: [
      'Up to 5 custom-designed pages',
      'Mobile-responsive website',
      'Services and portfolio showcase',
      'Contact form & WhatsApp integration',
      'Basic on-page SEO architecture',
      'Deployment and handover',
    ],
  },
  {
    id: 'intelligent-reception',
    number: '02',
    name: 'ORION Intelligent Reception',
    subtitle: '24/7 AI Customer Assistant',
    pkr: 'PKR 95,000',
    aed: 'AED 2,500',
    accent: 'purple',
    icon: Bot,
    features: [
      'AI inquiry assistant (website or voice, as scoped)',
      'Business FAQs knowledge training',
      'Lead information collection',
      'Inquiry notifications & dispatch',
      'One agreed integration',
      'Testing and handover',
    ],
  },
  {
    id: 'business-automation',
    number: '03',
    name: 'ORION Business Automation',
    subtitle: 'Streamlined Lead & Booking Pipelines',
    pkr: 'PKR 125,000',
    aed: 'AED 3,000',
    accent: 'green',
    icon: Cpu,
    features: [
      'Full CRM setup & configuration',
      'Lead capture workflow',
      'Automated client notifications',
      'Automated follow-up workflow',
      'One booking or calendar integration',
      'Basic analytics reporting',
    ],
  },
  {
    id: 'complete-business-system',
    number: '04',
    name: 'ORION Complete Business System',
    subtitle: 'End-to-End Enterprise Growth Engine',
    pkr: 'PKR 225,000',
    aed: 'AED 5,000',
    flagship: true,
    accent: 'gold',
    icon: Crown,
    features: [
      'Premium custom website experience',
      'Autonomous AI inquiry assistant',
      'Comprehensive lead qualification',
      'Full CRM pipeline integration',
      'Consultation booking workflow',
      'Automated multi-step follow-ups',
      'Deployment, handover & team training',
    ],
  },
];

const MONTHLY_CARE_PLANS = [
  { name: 'Website Care', pkr: 'PKR 5,000 / mo', aed: 'AED 150 / mo', desc: 'Updates, uptime monitoring, security & minor improvements' },
  { name: 'AI System Care', pkr: 'PKR 12,000 / mo', aed: 'AED 350 / mo', desc: 'Prompt tuning, model optimization, intent tweaks & logs' },
  { name: 'Automation Care', pkr: 'PKR 15,000 / mo', aed: 'AED 450 / mo', desc: 'Webhook maintenance, CRM sync, error handling & alerts' },
  { name: 'Managed Business System', pkr: 'PKR 25,000 / mo', aed: 'AED 700 / mo', desc: 'Full-suite proactive support across web, AI & automations' },
];

const WORK_STEPS = [
  { num: '01', title: '50% Advance', desc: 'Work begins once scope is agreed and 50% advance is received.' },
  { num: '02', title: 'Build & Review', desc: 'We design and engineer to scope with structured revision rounds.' },
  { num: '03', title: 'Final 50% & Handover', desc: 'The remaining 50% is paid before production deployment & handover.' },
];

export function PricingSection() {
  const [currency, setCurrency] = useState<'PKR' | 'AED'>('PKR');

  const getAccentColors = (accent: PricingTier['accent'], flagship?: boolean) => {
    if (flagship) {
      return {
        badgeBg: 'bg-[#F2B84B]/15 border-[#F2B84B]/40 text-[#F2B84B]',
        border: 'border-[#F2B84B]/40 hover:border-[#F2B84B]/70 shadow-[0_24px_70px_rgba(242,184,75,0.14)]',
        glow: 'from-[#F2B84B]/20 via-[#7B4DFF]/15 to-transparent',
        iconBox: 'bg-[#F2B84B]/15 text-[#F2B84B] border-[#F2B84B]/40',
        check: 'text-[#F2B84B]',
        priceColor: 'text-[#F5F7FF]',
      };
    }
    switch (accent) {
      case 'blue':
        return {
          badgeBg: 'bg-[#2F6BFF]/15 border-[#2F6BFF]/35 text-[#2F6BFF]',
          border: 'border-[rgba(255,255,255,0.1)] hover:border-[#2F6BFF]/50 shadow-[0_20px_50px_rgba(2,4,14,0.7)]',
          glow: 'from-[#2F6BFF]/15 via-transparent to-transparent',
          iconBox: 'bg-[#2F6BFF]/15 text-[#2F6BFF] border-[#2F6BFF]/35',
          check: 'text-[#2F6BFF]',
          priceColor: 'text-[#F5F7FF]',
        };
      case 'purple':
        return {
          badgeBg: 'bg-[#7B4DFF]/15 border-[#7B4DFF]/35 text-[#7B4DFF]',
          border: 'border-[rgba(255,255,255,0.1)] hover:border-[#7B4DFF]/50 shadow-[0_20px_50px_rgba(2,4,14,0.7)]',
          glow: 'from-[#7B4DFF]/15 via-transparent to-transparent',
          iconBox: 'bg-[#7B4DFF]/15 text-[#7B4DFF] border-[#7B4DFF]/35',
          check: 'text-[#7B4DFF]',
          priceColor: 'text-[#F5F7FF]',
        };
      case 'green':
        return {
          badgeBg: 'bg-[#22C55E]/15 border-[#22C55E]/35 text-[#22C55E]',
          border: 'border-[rgba(255,255,255,0.1)] hover:border-[#22C55E]/50 shadow-[0_20px_50px_rgba(2,4,14,0.7)]',
          glow: 'from-[#22C55E]/15 via-transparent to-transparent',
          iconBox: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/35',
          check: 'text-[#22C55E]',
          priceColor: 'text-[#F5F7FF]',
        };
      default:
        return {
          badgeBg: 'bg-[#2F6BFF]/15 border-[#2F6BFF]/35 text-[#2F6BFF]',
          border: 'border-[rgba(255,255,255,0.1)] hover:border-[#2F6BFF]/50',
          glow: 'from-[#2F6BFF]/15 via-transparent to-transparent',
          iconBox: 'bg-[#2F6BFF]/15 text-[#2F6BFF] border-[#2F6BFF]/35',
          check: 'text-[#2F6BFF]',
          priceColor: 'text-[#F5F7FF]',
        };
    }
  };

  return (
    <section id="pricing" className="relative z-10 py-[120px] md:py-[140px]">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section Header & Currency Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 md:mb-16">
          <SectionHeading
            eyebrow="08 / INVESTMENT & TIERS"
            firstLine="SERVICE PACKAGES"
            secondLine="&amp; PRICING."
            accentColor="gold"
            subtitle="Four transparent packages built to grow with your business. Same high-standard inclusions apply across Pakistan and the UAE."
          />

          {/* Currency Toggle (PKR / AED) */}
          <div className="flex items-center gap-3 p-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] backdrop-blur-xl shrink-0 self-start lg:self-end">
            <span className="font-mono-label text-[10px] text-[#8B93B7] px-3">
              MARKET CURRENCY:
            </span>
            <button
              type="button"
              onClick={() => setCurrency('PKR')}
              data-cursor-hover="true"
              className={`px-4 py-2 rounded-full font-mono-label text-[11px] font-bold transition-all cursor-pointer ${
                currency === 'PKR'
                  ? 'bg-[#2F6BFF] text-[#F5F7FF] shadow-[0_0_20px_rgba(47,107,255,0.5)]'
                  : 'text-[#8B93B7] hover:text-[#F5F7FF]'
              }`}
            >
              🇵🇰 PKR (Pakistan)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('AED')}
              data-cursor-hover="true"
              className={`px-4 py-2 rounded-full font-mono-label text-[11px] font-bold transition-all cursor-pointer ${
                currency === 'AED'
                  ? 'bg-[#F2B84B] text-[#050816] shadow-[0_0_20px_rgba(242,184,75,0.5)]'
                  : 'text-[#8B93B7] hover:text-[#F5F7FF]'
              }`}
            >
              🇦🇪 AED (UAE)
            </button>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const styles = getAccentColors(tier.accent, tier.flagship);
            const IconComponent = tier.icon;
            const price = currency === 'PKR' ? tier.pkr : tier.aed;
            const altPrice = currency === 'PKR' ? tier.aed : tier.pkr;

            return (
              <div
                key={tier.id}
                className={`relative rounded-[32px] bg-[#070C22]/90 backdrop-blur-2xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${styles.border}`}
              >
                {/* Ambient Top Glow */}
                <div
                  className={`absolute top-0 inset-x-0 h-40 rounded-t-[32px] bg-gradient-to-b ${styles.glow} pointer-events-none opacity-50`}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  {/* Tier Number & Flagship Badge */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="font-mono-label text-[13px] font-bold text-[#8B93B7] tabular-nums">
                      TIER {tier.number}
                    </span>

                    {tier.flagship ? (
                      <span className="px-3 py-1 rounded-full bg-[#F2B84B] text-[#050816] font-mono-label text-[9.5px] font-extrabold tracking-wider shadow-[0_0_16px_rgba(242,184,75,0.6)]">
                        ★ FLAGSHIP SYSTEM
                      </span>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full border font-mono-label text-[9px] ${styles.badgeBg}`}>
                        ONE-TIME
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${styles.iconBox}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-[17px] text-[#F5F7FF] leading-snug">
                        {tier.name}
                      </h3>
                    </div>
                  </div>

                  <p className="font-body text-[13px] text-[#8B93B7] leading-relaxed mb-6">
                    {tier.subtitle}
                  </p>

                  {/* Price Tag */}
                  <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.08)] mb-6">
                    <div className="font-display font-black text-[24px] sm:text-[28px] tracking-tight text-[#F5F7FF]">
                      {price}
                    </div>
                    <div className="flex items-center justify-between mt-1 font-mono-label text-[10px] text-[#8B93B7]">
                      <span>One-time implementation</span>
                      <span className="text-[#8B93B7]/70">({altPrice})</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="font-mono-label text-[10px] text-[#8B93B7] uppercase block mb-3">
                      INCLUDED IN SCOPE
                    </span>
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-[13px] font-body text-[#F5F7FF]/90 leading-tight">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${styles.check}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="relative z-10 mt-8 pt-5 border-t border-[rgba(255,255,255,0.08)]">
                  <a
                    href={`https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(tier.name)}%20package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover="true"
                    className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full font-mono-label text-[11px] font-bold px-5 py-3 transition-all duration-200 ${
                      tier.flagship
                        ? 'bg-[#F2B84B] text-[#050816] shadow-[0_0_24px_rgba(242,184,75,0.5)] hover:bg-[#F6C665]'
                        : 'bg-[rgba(255,255,255,0.04)] text-[#F5F7FF] border border-[rgba(255,255,255,0.12)] hover:border-[#2F6BFF]/50 hover:bg-[#2F6BFF]/10'
                    }`}
                  >
                    <span>SELECT PACKAGE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Footnote */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#070C22]/80 border border-[rgba(255,255,255,0.08)] flex items-center justify-between flex-wrap gap-3 font-mono-label text-[11.5px] text-[#8B93B7]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2B84B]" />
            <span>
              <strong>Note:</strong> AI usage, telephony, and monthly care plans are charged separately.
            </span>
          </div>
          <span className="text-[#8B93B7]/70">
            Introductory launch pricing for both markets · Larger scopes quoted on request
          </span>
        </div>

        {/* Monthly Care Plans Table */}
        <div className="mt-14 p-6 sm:p-8 rounded-[32px] bg-[#070C22]/70 border border-[rgba(255,255,255,0.08)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)]">
            <div>
              <span className="font-mono-label text-[10px] text-[#2F6BFF] uppercase block mb-1">
                POST-LAUNCH MAINTENANCE
              </span>
              <h4 className="font-display font-bold text-[18px] sm:text-[20px] uppercase text-[#F5F7FF]">
                Optional Monthly Care Plans
              </h4>
            </div>
            <span className="font-mono-label text-[10.5px] text-[#8B93B7]">
              SUPPORT · MONITORING · CONTINUOUS IMPROVEMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MONTHLY_CARE_PLANS.map((plan) => (
              <div
                key={plan.name}
                className="p-5 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex flex-col justify-between"
              >
                <div>
                  <h5 className="font-display font-bold text-[15px] text-[#F5F7FF] mb-1">
                    {plan.name}
                  </h5>
                  <p className="font-body text-[12px] text-[#8B93B7] leading-relaxed mb-4">
                    {plan.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] font-mono-label text-[12px] font-bold text-[#22C55E]">
                  {currency === 'PKR' ? plan.pkr : plan.aed}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How We Work 3-Step Milestone Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {WORK_STEPS.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-[24px] bg-[#070C22]/70 border border-[rgba(255,255,255,0.08)] flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/35 font-mono-label font-bold text-[14px] text-[#2F6BFF] flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div>
                <h5 className="font-display font-bold text-[15px] uppercase text-[#F5F7FF] mb-1">
                  {step.title}
                </h5>
                <p className="font-body text-[13px] text-[#8B93B7] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CALL TO ACTION BLOCK: 'Grow Your Brand' + Animated WhatsApp Button */}
        <div className="mt-16 text-center rounded-[36px] bg-gradient-to-b from-[#09102E] to-[#050816] border border-[#2F6BFF]/30 p-8 sm:p-12 lg:p-16 shadow-[0_24px_80px_rgba(47,107,255,0.18)] relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, rgba(34,197,94,0.22) 0%, rgba(47,107,255,0.18) 45%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="font-mono-label text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2B84B] mb-4 px-4 py-1.5 rounded-full bg-[#F2B84B]/10 border border-[#F2B84B]/30">
              LET&apos;S BUILD YOUR SYSTEM
            </span>

            {/* Exact Tagline in Bold Attractive Typography */}
            <h3
              className="font-display font-extrabold uppercase tracking-tight text-[#F5F7FF] leading-none mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                textWrap: 'balance',
              }}
            >
              Grow Your <span className="italic text-signature-gradient">Brand.</span>
            </h3>

            <p className="font-body text-[16px] sm:text-[18px] text-[#8B93B7] leading-relaxed mb-8 max-w-xl">
              Book a short discovery call with founder Muhammad Mayer Chishty. We discuss your exact project scope, timeline, and automation goals.
            </p>

            {/* Engaging Animated WhatsApp Button */}
            <a
              href="https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20am%20ready%20to%20grow%20my%20brand.%20Let%27s%20discuss%20pricing%20and%20implementation."
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover="true"
              className="group relative inline-flex items-center gap-3.5 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-[#22C55E] text-[#050816] font-mono-label font-bold text-[13px] sm:text-[14px] tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(34,197,94,0.65)] hover:shadow-[0_0_55px_rgba(34,197,94,0.95)] overflow-hidden"
            >
              {/* Pulsing ring animation */}
              <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-30 pointer-events-none" />

              {/* WhatsApp Icon */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="transition-transform duration-300 group-hover:rotate-12 shrink-0"
                aria-hidden="true"
              >
                <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.12.553 4.19 1.603 6.009L.068 23.932l6.064-1.589a12.012 12.012 0 005.899 1.545h.005c6.632 0 12.026-5.394 12.026-12.031C24.062 5.394 18.663 0 12.031 0zm0 22.029h-.004a9.98 9.98 0 01-5.086-1.39l-.365-.216-3.778.99.1-3.684-.237-.377A9.976 9.976 0 012.026 12.03C2.026 6.516 6.517 2.026 12.031 2.026c2.673 0 5.186 1.042 7.078 2.934a9.948 9.948 0 012.929 7.071c0 5.515-4.49 10.005-10.007 10.005zm5.485-7.483c-.3-.15-1.776-.877-2.052-.977-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-.893-.797-1.496-1.782-1.671-2.083-.175-.3-.019-.462.131-.611.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.626-.925-2.228-.243-.585-.49-.506-.675-.515-.175-.009-.375-.011-.575-.011-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.502 0 1.476 1.075 2.899 1.225 3.1.15.2 2.115 3.23 5.123 4.53 3.008 1.3 3.008.867 3.558.817.55-.05 1.776-.726 2.026-1.427.25-.7.25-1.301.175-1.427-.075-.125-.275-.2-.575-.35z" />
              </svg>
              <span>CHAT ON WHATSAPP (+92 316 4338095)</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            <div className="mt-4 font-mono-label text-[11px] text-[#8B93B7]">
              Typically replies in minutes · Direct founder communication
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
