interface SectionHeadingProps {
  eyebrow?: string;
  firstLine: string;
  secondLine: string;
  subtitle?: string;
  align?: 'left' | 'center';
  accentColor?: 'blue' | 'gold' | 'ai';
  as?: 'h1' | 'h2';
}

/**
 * Design System Headline Pattern with fluid clamp() typography:
 * - First line in white (#F5F7FF) wide bold uppercase ("Unbounded")
 * - Second line in italic with the blue-to-violet signature gradient text fill,
 *   ending with a gradient full stop
 */
export function SectionHeading({
  eyebrow,
  firstLine,
  secondLine,
  subtitle,
  align = 'left',
  accentColor = 'blue',
  as: HeadingTag = 'h2',
}: SectionHeadingProps) {
  const cleanSecondLine = secondLine.endsWith('.')
    ? secondLine.slice(0, -1)
    : secondLine;

  const dotColorClass =
    accentColor === 'gold'
      ? 'text-[#F2B84B]'
      : accentColor === 'ai'
      ? 'text-[#22C55E]'
      : 'text-signature-gradient';

  const eyebrowDotColor =
    accentColor === 'gold'
      ? 'bg-[#F2B84B] shadow-[0_0_10px_#F2B84B]'
      : accentColor === 'ai'
      ? 'bg-[#22C55E] shadow-[0_0_10px_#22C55E]'
      : 'bg-[#2F6BFF] shadow-[0_0_10px_#2F6BFF]';

  return (
    <div className={align === 'center' ? 'text-center mx-auto max-w-4xl' : 'text-left max-w-4xl'}>
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2.5 mb-4 sm:mb-5 ${
            align === 'center' ? 'justify-center' : 'justify-start'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${eyebrowDotColor}`} aria-hidden="true" />
          <span className="font-mono-label text-[11px] md:text-[12px] text-[#8B93B7] font-medium">
            {eyebrow}
          </span>
        </div>
      )}

      <HeadingTag
        className="font-display uppercase tracking-[-0.02em] leading-[1.06]"
        style={{
          textWrap: 'balance',
          fontSize:
            HeadingTag === 'h1'
              ? 'clamp(1.85rem, 4.6vw + 0.6rem, 4.25rem)'
              : 'clamp(1.65rem, 3.6vw + 0.5rem, 3.5rem)',
        }}
      >
        <span className="block font-extrabold text-[#F5F7FF]">{firstLine}</span>
        <span className="block italic font-bold text-signature-gradient mt-1 pr-2">
          {cleanSecondLine}
          <span className={dotColorClass}>.</span>
        </span>
      </HeadingTag>

      {subtitle && (
        <p
          className={`mt-5 sm:mt-6 font-body leading-[1.65] text-[#8B93B7] max-w-2xl ${
            align === 'center' ? 'mx-auto' : ''
          }`}
          style={{ fontSize: 'clamp(0.95rem, 0.5vw + 0.85rem, 1.125rem)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
