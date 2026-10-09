import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { OrionLogo } from './OrionLogo';
import { useSmoothScroll } from './SmoothScrollProvider';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'HOME', href: '#home' },
  { id: 'about', label: 'ABOUT', href: '#about' },
  { id: 'services', label: 'SERVICES', href: '#services' },
  { id: 'ai', label: 'AI AUTOMATION', href: '#ai' },
  { id: 'projects', label: 'PROJECTS', href: '#projects' },
  { id: 'founder', label: 'FOUNDER', href: '#founder' },
  { id: 'contact', label: 'CONTACT', href: '#contact' },
];

export function Navbar() {
  const [activeId, setActiveId] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    let rafId: number | null = null;

    const updateOnScroll = () => {
      rafId = null;
      const y = window.scrollY;
      const nextScrolled = y > 48;
      setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));

      // Determine active section based on scroll position
      const viewportMiddle = y + window.innerHeight * 0.35;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= viewportMiddle) {
          setActiveId((prev) => (prev !== item.id ? item.id : prev));
          break;
        }
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateOnScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateOnScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Lock body scroll when mobile full-screen glass menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    setActiveId(item.id);
    setMobileMenuOpen(false);
    scrollTo(item.href, -20);
  };

  const handleBookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveId('contact');
    setMobileMenuOpen(false);
    scrollTo('#contact', -20);
  };

  return (
    <>
      <header className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          aria-label="Primary Navigation"
          initial={{ y: -24, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: isScrolled ? 0.965 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full max-w-[1260px] rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(5,8,22,0.68)] backdrop-blur-2xl shadow-[0_20px_50px_rgba(2,4,14,0.75),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 ${
            isScrolled ? 'py-2 px-4 md:px-5' : 'py-2.5 md:py-3 px-4 md:px-6'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Ring Mark + Wordmark "ORION" / "IT SOLUTIONS" */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, NAV_ITEMS[0])}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] rounded-full pr-2 shrink-0"
              data-cursor-hover="true"
            >
              <OrionLogo size={isScrolled ? 34 : 38} showWordmark={true} />
            </a>

            {/* Center Links (Desktop) */}
            <div className="hidden xl:flex items-center gap-0.5 rounded-full bg-[rgba(255,255,255,0.025)] p-1 border border-[rgba(255,255,255,0.06)]">
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    data-cursor-hover="true"
                    className={`relative px-3.5 py-2 rounded-full font-mono-label text-[10.5px] font-medium whitespace-nowrap transition-colors duration-200 ${
                      isActive ? 'text-[#F5F7FF]' : 'text-[#8B93B7] hover:text-[#F5F7FF]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2F6BFF]/25 to-[#7B4DFF]/25 border border-[#2F6BFF]/45 shadow-[0_0_20px_rgba(47,107,255,0.3)]"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {item.id === 'ai' && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]"
                          aria-hidden="true"
                        />
                      )}
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Right: BOOK APPOINTMENT Pill Button & Mobile Hamburger */}
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20would%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover="true"
                className={`hidden sm:inline-flex items-center gap-2 rounded-full bg-[#2F6BFF] text-[#F5F7FF] font-mono-label font-medium text-[11px] border border-[#6895FF]/40 shadow-[0_0_24px_rgba(47,107,255,0.5)] hover:bg-[#3B76FF] hover:shadow-[0_0_32px_rgba(47,107,255,0.75)] transition-all duration-200 whitespace-nowrap group ${
                  isScrolled ? 'px-4 py-2' : 'px-5 py-2.5'
                }`}
              >
                <span>BOOK APPOINTMENT</span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              {/* Mobile / Tablet Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                data-cursor-hover="true"
                className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-[#F5F7FF] hover:border-[#2F6BFF]/50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Full-Screen Glass Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#050816]/90 backdrop-blur-2xl flex flex-col justify-between px-6 pt-28 pb-10 xl:hidden"
          >
            <div className="max-w-md w-full mx-auto flex flex-col gap-2 my-auto">
              <div className="font-mono-label text-[10px] text-[#8B93B7] mb-3 px-4">
                NAVIGATION CONSTELLATION
              </div>

              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeId === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`relative flex items-center justify-between px-5 py-3.5 rounded-full font-display text-[16px] sm:text-[18px] tracking-wider uppercase transition-all ${
                      isActive
                        ? 'text-[#F5F7FF] bg-gradient-to-r from-[#2F6BFF]/25 to-[#7B4DFF]/20 border border-[#2F6BFF]/45 shadow-[0_0_24px_rgba(47,107,255,0.25)]'
                        : 'text-[#8B93B7] hover:text-[#F5F7FF] border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono-label text-[11px] text-[#2F6BFF]">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                      {item.id === 'ai' && (
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
                      )}
                    </span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </motion.a>
                );
              })}
            </div>

            <div className="max-w-md w-full mx-auto pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-4">
              <a
                href="https://wa.me/923164338095?text=Hello%20ORION%20IT%20SOLUTIONS%2C%20I%20would%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2F6BFF] text-[#F5F7FF] font-mono-label font-medium text-[12px] py-4 px-6 shadow-[0_0_28px_rgba(47,107,255,0.5)]"
              >
                <span>BOOK APPOINTMENT</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-between font-mono-label text-[10px] text-[#8B93B7] px-2">
                <span>LAHORE, PAKISTAN</span>
                <span>WHERE BRANDS BECOME STARS</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
