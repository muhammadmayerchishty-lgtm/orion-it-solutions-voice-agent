import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getDeviceTier } from '../lib/deviceTier';

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
}

/**
 * Design System Pill Button:
 * - Primary: solid #2F6BFF with blue glow + magnetic hover pull
 * - Secondary: ghost with 1px glass border
 * - Minimum 44px tap target for accessibility
 * - Mono uppercase labels (letter-spacing 0.12em) with a small arrow icon
 */
export function PillButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  size = 'md',
  showArrow = true,
}: PillButtonProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (variant !== 'primary' || !elRef.current || getDeviceTier() === 'low') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${(x * 0.18).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px, 0)`;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (!elRef.current) return;
    elRef.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  const sizeClasses = {
    sm: 'min-h-[44px] px-4 py-2 text-[11px] gap-1.5',
    md: 'min-h-[44px] px-6 py-3 text-[12px] gap-2',
    lg: 'min-h-[48px] px-7 py-3.5 text-[12px] md:text-[13px] gap-2.5',
  }[size];

  const variantClasses =
    variant === 'primary'
      ? 'bg-[#2F6BFF] text-[#F5F7FF] border border-[#5B8CFF]/40 shadow-[0_0_26px_rgba(47,107,255,0.45)] hover:bg-[#3B76FF] hover:shadow-[0_0_36px_rgba(47,107,255,0.7)]'
      : 'bg-[rgba(255,255,255,0.03)] text-[#F5F7FF] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(47,107,255,0.45)] hover:bg-[rgba(47,107,255,0.08)] backdrop-blur-md';

  const baseClasses = `group relative inline-flex items-center justify-center rounded-full font-mono-label font-medium whitespace-nowrap shrink-0 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${sizeClasses} ${variantClasses} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a
        ref={(node) => {
          elRef.current = node;
        }}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        data-cursor-hover="true"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        elRef.current = node;
      }}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
      data-cursor-hover="true"
    >
      {content}
    </button>
  );
}
