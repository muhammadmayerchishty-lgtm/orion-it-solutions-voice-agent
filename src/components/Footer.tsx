import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { OrionLogo } from './OrionLogo';
import { SafeImage } from './SafeImage';
import { NAV_ITEMS } from './Navbar';
import { useSmoothScroll } from './SmoothScrollProvider';
import { WHATSAPP_APPOINTMENT_URL } from '../sections/ContactSection';

const FOOTER_SERVICES = [
  'Website Design & Development',
  'UI/UX Design',
  'Graphic Design & Brand Identity',
  'Architecture & Interior Websites',
  'AI Automation & Workflows',
  'AI Voice Agents',
];

const FOOTER_CONNECT = [
  {
    label: 'WhatsApp (+92 316 4338095)',
    href: WHATSAPP_APPOINTMENT_URL,
    external: true,
  },
  {
    label: 'muhammadmayerchishty@gmail.com',
    href: 'mailto:muhammadmayerchishty@gmail.com',
    external: false,
  },
  {
    label: 'Instagram (@mayeroutreach_1)',
    href: 'https://www.instagram.com/mayeroutreach_1',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-mayer-chishty-8b269341a/',
    external: true,
  },
  {
    label: 'Founder Portfolio',
    href: 'https://muhammad-mayer-portfolio.vercel.app/',
    external: true,
  },
];

export function Footer() {
  const { scrollTo } = useSmoothScroll();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, -20);
  };

  const handleBackToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollTo('#home', 0);
  };

  return (
    <footer className="relative z-10 border-t border-[rgba(255,255,255,0.08)] bg-[#050816]/90 backdrop-blur-2xl overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-12">
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[rgba(255,255,255,0.08)]">
          {/* Brand Column (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <OrionLogo size={42} showWordmark={true} />
            <p className="mt-4 font-body italic text-[16px] text-[#F5F7FF]/90">
              Where Brands Become Stars.
            </p>
            <p className="mt-2 font-body text-[14px] text-[#8B93B7] max-w-sm leading-relaxed">
              Founder-led digital studio in Lahore, Pakistan crafting premium websites, brand
              identities, and AI-powered enquiry experiences.
            </p>
          </div>

          {/* Column 1: Navigation (2 Cols) */}
          <div className="lg:col-span-2">
            <div className="font-mono-label text-[11px] font-semibold text-[#F5F7FF] mb-4">
              NAVIGATION
            </div>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    data-cursor-hover="true"
                    className="font-body text-[14px] text-[#8B93B7] hover:text-[#F5F7FF] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Services (3 Cols) */}
          <div className="lg:col-span-3">
            <div className="font-mono-label text-[11px] font-semibold text-[#F5F7FF] mb-4">
              SERVICES
            </div>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map((srv) => (
                <li key={srv}>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, '#services')}
                    data-cursor-hover="true"
                    className="font-body text-[14px] text-[#8B93B7] hover:text-[#F5F7FF] transition-colors"
                  >
                    {srv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect (3 Cols) */}
          <div className="lg:col-span-3">
            <div className="font-mono-label text-[11px] font-semibold text-[#F5F7FF] mb-4">
              CONNECT
            </div>
            <ul className="space-y-2.5">
              {FOOTER_CONNECT.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    data-cursor-hover="true"
                    className="inline-flex items-center gap-1.5 font-body text-[14px] text-[#8B93B7] hover:text-[#F5F7FF] transition-colors"
                  >
                    <span className="truncate max-w-[230px]">{item.label}</span>
                    {item.external && <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-70" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Large Faded "ORION" Wordmark with Logo Ring */}
        <div className="py-10 md:py-12 flex items-center justify-center gap-4 sm:gap-8 select-none border-b border-[rgba(255,255,255,0.06)]">
          <SafeImage
            src="/images/orion-logo.svg"
            alt="Orion Emblem"
            width={96}
            height={96}
            className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain opacity-80 shrink-0"
          />
          <span
            className="font-display font-extrabold uppercase tracking-[0.18em] text-[44px] sm:text-[72px] md:text-[104px] lg:text-[128px] leading-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(245, 247, 255, 0.22) 0%, rgba(47, 107, 255, 0.08) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ORION
          </span>
        </div>

        {/* Bottom Legal & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono-label text-[11px] text-[#8B93B7]">
            © 2026 ORION IT SOLUTIONS. Crafted in Lahore, Pakistan.
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            data-cursor-hover="true"
            className="group min-h-[44px] inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.12)] hover:border-[#2F6BFF]/50 hover:bg-[#2F6BFF]/10 font-mono-label text-[11px] text-[#F5F7FF] transition-all cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#2F6BFF] transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
