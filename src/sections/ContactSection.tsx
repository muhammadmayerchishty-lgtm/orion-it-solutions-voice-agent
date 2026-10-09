import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Mail,
  Instagram,
  Linkedin,
  Globe,
  MapPin,
  Check,
  Calendar,
  Send,
  Sparkles,
} from 'lucide-react';

import { SectionHeading } from '../components/SectionHeading';
import { GlassCard } from '../components/GlassCard';

export const WHATSAPP_APPOINTMENT_URL =
  'https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20would%20like%20to%20book%20an%20appointment.';

const BUSINESS_TYPES = [
  'Architecture Firm',
  'Interior Design',
  'Restaurant/Cafe',
  'Brand/E-commerce',
  'Other',
];

const SERVICES_OPTIONS = [
  'Premium Website Design & Development',
  'UI/UX Design',
  'Graphic Design & Brand Identity',
  'Social Media & Marketing Design',
  'Architecture & Interior Design Firm Websites',
  'Digital Portfolios & Interactive Showcases',
  'AI Automation & Workflow Solutions',
  'AI Voice Agents & AI-Powered Enquiry Experiences',
];

export function ContactSection() {
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [serviceNeeded, setServiceNeeded] = useState(SERVICES_OPTIONS[0]);
  const [preferredDate, setPreferredDate] = useState('');
  const [shortMessage, setShortMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [aiBurstActive, setAiBurstActive] = useState(false);

  const burstTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) {
        window.clearTimeout(burstTimerRef.current);
      }
    };
  }, []);

  const openExternalNewTab = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedMessage = shortMessage.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!preferredDate) {
      setErrorMsg('Please select a preferred appointment date.');
      return;
    }
    if (!trimmedMessage) {
      setErrorMsg('Please enter a short message about your project.');
      return;
    }

    const formattedText = [
      'Hello ORION IT SOLUTIONS, I would like to book an appointment.',
      '',
      `Name: ${trimmedName}`,
      `Business Type: ${businessType}`,
      `Service Needed: ${serviceNeeded}`,
      `Preferred Date: ${preferredDate}`,
      `Message: ${trimmedMessage}`,
    ].join('\n');

    const encodedUrl = `https://wa.me/923164338095?text=${encodeURIComponent(formattedText)}`;
    setSubmitted(true);
    openExternalNewTab(encodedUrl);
  };

  const handleOrionAiContactBurst = () => {
    setAiBurstActive(true);
    if (burstTimerRef.current) {
      window.clearTimeout(burstTimerRef.current);
    }
    burstTimerRef.current = window.setTimeout(() => {
      setAiBurstActive(false);
      openExternalNewTab(WHATSAPP_APPOINTMENT_URL);
    }, 900);
  };

  return (
    <section id="contact" className="relative z-10 py-[120px] md:py-[140px]">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section Headline */}
        <div className="mb-14 md:mb-16">
          <SectionHeading
            eyebrow="07 / CONTACT"
            firstLine="LET'S BUILD"
            secondLine="SOMETHING BRIGHT."
            subtitle="Tell us about your brand and we will reply on WhatsApp."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT 7 COLUMNS: BOOKING CARD (Large Glass Card, Gradient Border) */}
          <div className="lg:col-span-7">
            <GlassCard className="p-7 sm:p-9 md:p-10 border-[#2F6BFF]/40 shadow-[0_0_50px_rgba(47,107,255,0.14)]">
              {/* Direct Primary WhatsApp Button */}
              <div className="pb-8 mb-8 border-b border-[rgba(255,255,255,0.08)]">
                <span className="font-mono-label text-[10px] text-[#22C55E] block mb-3">
                  INSTANT DIRECT CHANNEL
                </span>
                <a
                  href={WHATSAPP_APPOINTMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover="true"
                  className="w-full group inline-flex items-center justify-center gap-3 rounded-full bg-[#2F6BFF] hover:bg-[#3B76FF] text-[#F5F7FF] border border-[#6C98FF]/45 shadow-[0_0_32px_rgba(47,107,255,0.55)] hover:shadow-[0_0_44px_rgba(47,107,255,0.8)] py-4 px-6 font-mono-label text-[12px] sm:text-[13px] font-semibold transition-all duration-200"
                >
                  {/* WhatsApp Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="text-[#22C55E] shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.156-1.359c1.484.813 3.172 1.25 4.875 1.25 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.828 14.125c-.25.703-1.438 1.344-2.016 1.422-.531.078-1.219.109-1.969-.125-.453-.141-1.047-.344-1.797-.672-3.156-1.359-5.219-4.547-5.375-4.75-.156-.203-1.281-1.703-1.281-3.25s.813-2.313 1.109-2.625c.297-.313.641-.391.859-.391.219 0 .422.016.609.016.188 0 .453-.078.703.531.266.625.891 2.172.969 2.328.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.141.141-.297.297-.125.594.172.297.766 1.266 1.641 2.047 1.125 1.016 2.078 1.328 2.375 1.484.297.156.469.125.641-.078.172-.203.75-.875.953-1.172.203-.297.406-.25.672-.156.266.094 1.703.813 1.984.953.297.141.484.219.563.344.078.125.078.719-.172 1.422z" />
                  </svg>
                  <span>BOOK APPOINTMENT ON WHATSAPP</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Mini Booking Form */}
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono-label text-[11px] font-semibold text-[#F5F7FF]">
                  CUSTOM PROJECT BRIEF FORM
                </span>
                <span className="font-mono-label text-[10px] text-[#8B93B7]">
                  OPENS DIRECTLY IN WHATSAPP
                </span>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 rounded-[26px] bg-[#22C55E]/10 border border-[#22C55E]/40 text-center flex flex-col items-center justify-center min-h-[320px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-[#22C55E] text-[#050816] flex items-center justify-center shadow-[0_0_32px_rgba(34,197,94,0.65)] mb-5"
                    >
                      <Check className="w-8 h-8 stroke-[2.8]" />
                    </motion.div>
                    <h3 className="font-display font-bold text-[20px] uppercase text-[#F5F7FF]">
                      APPOINTMENT BRIEF READY
                    </h3>
                    <p className="font-body text-[14.5px] text-[#8B93B7] mt-2 max-w-md">
                      Your formatted project brief has been opened in WhatsApp. Send the message
                      there and Muhammad Mayer Chishty will reply shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 px-6 py-2.5 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.14)] font-mono-label text-[11px] text-[#F5F7FF] hover:border-[#2F6BFF] transition-colors cursor-pointer"
                    >
                      EDIT OR SEND ANOTHER BRIEF
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="booking-name"
                          className="block font-mono-label text-[10px] text-[#8B93B7] mb-2"
                        >
                          YOUR NAME *
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Tariq Mahmood"
                          required
                          className="w-full px-4 py-3.5 rounded-2xl bg-[#050816]/85 border border-[rgba(255,255,255,0.1)] text-[#F5F7FF] placeholder-[#8B93B7]/50 font-body text-[14px] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                        />
                      </div>

                      {/* Business Type */}
                      <div>
                        <label
                          htmlFor="booking-business-type"
                          className="block font-mono-label text-[10px] text-[#8B93B7] mb-2"
                        >
                          BUSINESS TYPE *
                        </label>
                        <select
                          id="booking-business-type"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[#050816]/95 border border-[rgba(255,255,255,0.1)] text-[#F5F7FF] font-body text-[14px] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                        >
                          {BUSINESS_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-[#050816] text-[#F5F7FF]">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Service Needed */}
                      <div>
                        <label
                          htmlFor="booking-service"
                          className="block font-mono-label text-[10px] text-[#8B93B7] mb-2"
                        >
                          SERVICE NEEDED *
                        </label>
                        <select
                          id="booking-service"
                          value={serviceNeeded}
                          onChange={(e) => setServiceNeeded(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-[#050816]/95 border border-[rgba(255,255,255,0.1)] text-[#F5F7FF] font-body text-[14px] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                        >
                          {SERVICES_OPTIONS.map((srv) => (
                            <option key={srv} value={srv} className="bg-[#050816] text-[#F5F7FF]">
                              {srv}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preferred Date */}
                      <div>
                        <label
                          htmlFor="booking-date"
                          className="block font-mono-label text-[10px] text-[#8B93B7] mb-2"
                        >
                          PREFERRED DATE *
                        </label>
                        <div className="relative">
                          <input
                            id="booking-date"
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            required
                            className="w-full px-4 py-3.5 rounded-2xl bg-[#050816]/85 border border-[rgba(255,255,255,0.1)] text-[#F5F7FF] font-body text-[14px] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                          />
                          <Calendar className="w-4 h-4 text-[#8B93B7] pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block" />
                        </div>
                      </div>
                    </div>

                    {/* Short Message */}
                    <div>
                      <label
                        htmlFor="booking-message"
                        className="block font-mono-label text-[10px] text-[#8B93B7] mb-2"
                      >
                        SHORT MESSAGE *
                      </label>
                      <textarea
                        id="booking-message"
                        rows={3}
                        value={shortMessage}
                        onChange={(e) => setShortMessage(e.target.value)}
                        placeholder="Tell us about your project, goals, or timeline..."
                        required
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#050816]/85 border border-[rgba(255,255,255,0.1)] text-[#F5F7FF] placeholder-[#8B93B7]/50 font-body text-[14px] focus:outline-none focus:border-[#2F6BFF] transition-colors resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <div className="px-4 py-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 font-body text-[13px] text-[#FCA5A5]">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      data-cursor-hover="true"
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[#2F6BFF] text-[#F5F7FF] border border-[rgba(255,255,255,0.16)] hover:border-[#2F6BFF] hover:shadow-[0_0_28px_rgba(47,107,255,0.5)] py-3.5 px-6 font-mono-label text-[11.5px] font-semibold transition-all duration-200 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SEND BRIEF VIA WHATSAPP</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Secondary "Talk to ORION AI" option reusing the ThreeUI <GlassAiButton /> */}
              <div className="mt-8 pt-7 border-t border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
                    <span className="font-mono-label text-[10px] sm:text-[11px] text-[#8B93B7]">
                      SECONDARY OPTION · TALK TO ORION AI
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOrionAiContactBurst}
                    data-cursor-hover="true"
                    className="min-h-[44px] px-2 inline-flex items-center gap-1 font-mono-label text-[10px] text-[#F5F7FF] hover:text-[#2F6BFF] transition-colors cursor-pointer"
                  >
                    <span>{aiBurstActive ? 'OPENING WHATSAPP...' : 'LAUNCH ORION AI'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative w-full h-[138px] sm:h-[154px] rounded-[22px] overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#060B22] flex items-center justify-center">
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
                    onClick={handleOrionAiContactBurst}
                    data-cursor-hover="true"
                    className="group relative z-10 inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#2F6BFF]/30 via-[#7B4DFF]/30 to-[#2F6BFF]/30 border border-[rgba(255,255,255,0.22)] hover:border-[#2F6BFF]/70 shadow-[0_0_36px_rgba(47,107,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_0_48px_rgba(123,77,255,0.65)] transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F2B84B] transition-transform duration-300 group-hover:rotate-12" />
                    <span className="font-display font-bold text-[14px] sm:text-[15px] tracking-[0.16em] text-[#F5F7FF]">
                      ORION AI
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT 5 COLUMNS: CONTACT DETAILS STACK */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* 1. WhatsApp */}
            <a
              href={WHATSAPP_APPOINTMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover="true"
              className="group p-5 sm:p-6 rounded-[28px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[#22C55E]/50 hover:shadow-[0_0_32px_rgba(34,197,94,0.16)] backdrop-blur-xl transition-all duration-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/35 flex items-center justify-center text-[#22C55E] shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.156-1.359c1.484.813 3.172 1.25 4.875 1.25 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="font-mono-label text-[10px] text-[#8B93B7] block">
                    WHATSAPP
                  </span>
                  <span className="font-body font-semibold text-[15px] sm:text-[16px] text-[#F5F7FF] truncate block mt-0.5">
                    +92 316 4338095
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#8B93B7] group-hover:text-[#22C55E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* 2. Email */}
            <a
              href="mailto:muhammadmayerchishty@gmail.com"
              data-cursor-hover="true"
              className="group p-5 sm:p-6 rounded-[28px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[#2F6BFF]/50 hover:shadow-[0_0_32px_rgba(47,107,255,0.18)] backdrop-blur-xl transition-all duration-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/35 flex items-center justify-center text-[#2F6BFF] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono-label text-[10px] text-[#8B93B7] block">
                    EMAIL
                  </span>
                  <span className="font-body font-semibold text-[14px] sm:text-[15px] text-[#F5F7FF] truncate block mt-0.5">
                    muhammadmayerchishty@gmail.com
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#8B93B7] group-hover:text-[#2F6BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* 3. Instagram */}
            <a
              href="https://www.instagram.com/mayeroutreach_1"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover="true"
              className="group p-5 sm:p-6 rounded-[28px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[#7B4DFF]/50 hover:shadow-[0_0_32px_rgba(123,77,255,0.18)] backdrop-blur-xl transition-all duration-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#7B4DFF]/15 border border-[#7B4DFF]/35 flex items-center justify-center text-[#7B4DFF] shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono-label text-[10px] text-[#8B93B7] block">
                    INSTAGRAM
                  </span>
                  <span className="font-body font-semibold text-[15px] sm:text-[16px] text-[#F5F7FF] truncate block mt-0.5">
                    @mayeroutreach_1
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#8B93B7] group-hover:text-[#7B4DFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* 4. LinkedIn */}
            <a
              href="https://www.linkedin.com/in/muhammad-mayer-chishty-8b269341a/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover="true"
              className="group p-5 sm:p-6 rounded-[28px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[#2F6BFF]/50 hover:shadow-[0_0_32px_rgba(47,107,255,0.18)] backdrop-blur-xl transition-all duration-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#2F6BFF]/15 border border-[#2F6BFF]/35 flex items-center justify-center text-[#2F6BFF] shrink-0">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono-label text-[10px] text-[#8B93B7] block">
                    LINKEDIN
                  </span>
                  <span className="font-body font-semibold text-[15px] sm:text-[16px] text-[#F5F7FF] truncate block mt-0.5">
                    Muhammad Mayer Chishty
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#8B93B7] group-hover:text-[#2F6BFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* 5. Portfolio */}
            <a
              href="https://muhammad-mayer-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover="true"
              className="group p-5 sm:p-6 rounded-[28px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[#F2B84B]/50 hover:shadow-[0_0_32px_rgba(242,184,75,0.16)] backdrop-blur-xl transition-all duration-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#F2B84B]/15 border border-[#F2B84B]/35 flex items-center justify-center text-[#F2B84B] shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono-label text-[10px] text-[#8B93B7] block">
                    PORTFOLIO
                  </span>
                  <span className="font-body font-semibold text-[14px] sm:text-[15px] text-[#F5F7FF] truncate block mt-0.5">
                    muhammad-mayer-portfolio.vercel.app
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#8B93B7] group-hover:text-[#F2B84B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* 6. Location (Text Only) */}
            <div className="p-5 sm:p-6 rounded-[28px] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#F5F7FF] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono-label text-[10px] text-[#8B93B7] block">
                  LOCATION
                </span>
                <span className="font-body font-semibold text-[15px] sm:text-[16px] text-[#F5F7FF] block mt-0.5">
                  Lahore, Pakistan
                </span>
              </div>
            </div>

            {/* 7. Availability Chip */}
            <div className="p-5 rounded-[24px] bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center gap-3.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
              </span>
              <span className="font-body text-[14px] font-medium text-[#F5F7FF]">
                Available for freelance and remote projects.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
