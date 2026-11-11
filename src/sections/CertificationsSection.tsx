import { useState } from 'react';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Download,
  CheckCircle2,
  FileText,
  Building,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { SafeImage } from '../components/SafeImage';

export function CertificationsSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="certifications" className="relative z-10 py-[120px] md:py-[140px]">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section Heading */}
        <div className="mb-14 md:mb-16">
          <SectionHeading
            eyebrow="07 / CREDENTIALS & AUTHORITY"
            firstLine="CERTIFIED"
            secondLine="EXCELLENCE."
            accentColor="gold"
            subtitle="Government-backed artificial intelligence and prompt engineering credentials aligning with international enterprise standards."
          />
        </div>

        {/* Featured Certificate Card */}
        <div className="relative rounded-[36px] overflow-hidden border border-[rgba(242,184,75,0.35)] bg-[#070C22]/90 backdrop-blur-2xl shadow-[0_32px_90px_rgba(2,4,14,0.88),inset_0_1px_1px_rgba(255,255,255,0.12)] p-6 sm:p-10 lg:p-12">
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(circle at 100% 0%, rgba(242,184,75,0.35) 0%, rgba(47,107,255,0.2) 50%, transparent 75%)',
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 6 Columns: Certificate Visual Showcase with Modal & Zoom */}
            <div className="lg:col-span-6">
              <div
                onClick={() => setModalOpen(true)}
                className="group/cert relative rounded-[28px] overflow-hidden border border-[rgba(255,255,255,0.14)] bg-[#0A0E24] shadow-[0_24px_60px_rgba(2,4,14,0.85)] cursor-pointer"
                data-cursor-hover="true"
              >
                {/* Certificate Display Container */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-white/5">
                  <SafeImage
                    src="/images/dubai-future-foundation-certificate.webp"
                    fallbackSrc="/images/dubai-future-foundation-certificate.png"
                    alt="One Million Prompters Certificate of Completion issued to Muhammad Mayer Chishty by Dubai Future Foundation"
                    width={1200}
                    height={825}
                    placeholderGradient="linear-gradient(135deg, #091228 0%, #152248 50%, #3B2E15 100%)"
                    className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover/cert:scale-[1.03]"
                  />

                  {/* Hover Overlay with Action Pill */}
                  <div className="absolute inset-0 bg-[#050816]/50 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span className="px-5 py-2.5 rounded-full bg-[#050816]/90 border border-[#F2B84B]/60 text-[#F5F7FF] font-mono-label text-[11px] flex items-center gap-2 shadow-[0_0_24px_rgba(242,184,75,0.4)]">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" />
                      CLICK TO ENLARGE CERTIFICATE
                    </span>
                  </div>
                </div>

                {/* Bottom Spec Strip */}
                <div className="p-4 bg-[#0A0E24]/95 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between font-mono-label text-[10.5px]">
                  <div className="flex items-center gap-2 text-[#F2B84B]">
                    <ShieldCheck className="w-4 h-4 text-[#F2B84B]" />
                    <span>VERIFIED CREDENTIAL</span>
                  </div>
                  <span className="text-[#8B93B7]">HIGH RESOLUTION · OFFICIAL PDF</span>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Credential Authority & Metadata Details */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#F2B84B]/15 border border-[#F2B84B]/40 font-mono-label text-[10.5px] font-semibold text-[#F2B84B] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    DUBAI CENTRE FOR ARTIFICIAL INTELLIGENCE
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#2F6BFF]/15 border border-[#2F6BFF]/35 font-mono-label text-[10px] text-[#2F6BFF]">
                    UAE GOVERNMENT INITIATIVE
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-[24px] sm:text-[32px] uppercase text-[#F5F7FF] tracking-tight leading-tight">
                  One Million Prompters
                </h3>
                <div className="font-mono-label text-[12px] sm:text-[13px] text-[#F2B84B] font-semibold mt-1.5">
                  Certificate of Completion
                </div>

                {/* Recipient Details */}
                <div className="mt-5 p-4 rounded-2xl bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                  <div>
                    <span className="font-mono-label text-[10px] text-[#8B93B7] uppercase block">
                      CREDENTIAL RECIPIENT
                    </span>
                    <span className="font-display font-bold text-[15px] sm:text-[16px] text-[#F5F7FF]">
                      MUHAMMAD MAYER CHISHTY
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/35 font-mono-label text-[10px] text-[#22C55E] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ISSUED &amp; VERIFIED
                  </span>
                </div>

                {/* Official Description */}
                <p className="mt-5 font-body text-[14.5px] sm:text-[15.5px] text-[#8B93B7] leading-relaxed">
                  Successfully completed the landmark initiative launched by{' '}
                  <strong className="text-[#F5F7FF] font-semibold">
                    His Highness Sheikh Hamdan bin Mohammed bin Rashid Al Maktoum
                  </strong>
                  , Crown Prince of Dubai. Focusing on developing high-tier skills in prompt engineering
                  for advanced AI systems in alignment with the{' '}
                  <span className="text-[#F2B84B]">
                    Dubai Universal Blueprint for Artificial Intelligence
                  </span>
                  .
                </p>

                {/* Key Competencies Breakdown */}
                <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.08)] space-y-2">
                  <div className="font-mono-label text-[10px] text-[#8B93B7] uppercase mb-2">
                    CORE COMPETENCIES ACCREDITED
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-body text-[#F5F7FF]/90">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F2B84B]" />
                      <span>Enterprise Prompt Engineering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F2B84B]" />
                      <span>AI Conversational Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                      <span>Autonomous AI Voice Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                      <span>Dubai AI Blueprint Alignment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="/assets/aistudio/muhammad-mayer-chishty-certificate_a1424490.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover="true"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[#F2B84B] text-[#050816] font-mono-label font-bold text-[11.5px] px-6 py-3 shadow-[0_0_24px_rgba(242,184,75,0.45)] hover:bg-[#F6C665] transition-all duration-200"
                >
                  <FileText className="w-4 h-4 text-[#050816]" />
                  <span>VIEW OFFICIAL PDF</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#050816]" />
                </a>

                <a
                  href="/assets/aistudio/muhammad-mayer-chishty-certificate_a1424490.pdf"
                  download="Muhammad_Mayer_Chishty_Dubai_AI_Certificate.pdf"
                  data-cursor-hover="true"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(255,255,255,0.03)] text-[#F5F7FF] border border-[rgba(255,255,255,0.14)] hover:border-[#F2B84B]/50 hover:bg-[#F2B84B]/10 font-mono-label text-[11.5px] px-6 py-3 transition-all duration-200"
                >
                  <Download className="w-3.5 h-3.5 text-[#F2B84B]" />
                  <span>DOWNLOAD CREDENTIAL</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Modal Preview */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#050816]/92 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-[28px] overflow-hidden border border-[#F2B84B]/40 bg-[#0A0E24] p-4 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 font-mono-label text-[11px] text-[#8B93B7]">
              <span className="text-[#F2B84B]">DUBAI FUTURE FOUNDATION · ONE MILLION PROMPTERS</span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center">
              <SafeImage
                src="/images/dubai-future-foundation-certificate.webp"
                fallbackSrc="/images/dubai-future-foundation-certificate.png"
                alt="One Million Prompters Certificate Full View"
                width={1600}
                height={1100}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
