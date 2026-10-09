import React, { useState } from 'react';

export interface SafeImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /**
   * Primary image path (e.g. "/images/glow-theory.webp" or "/images/founder.jpg" or "/images/orion-logo.svg").
   * Automatically resolves a WebP source and a PNG/JPG fallback when using <picture>.
   */
  src: string;
  /**
   * Explicit WebP source URL override (defaults to deriving .webp from `src`).
   */
  webpSrc?: string;
  /**
   * Explicit PNG/JPG fallback URL override (defaults to deriving .png/.jpg from `src`).
   */
  fallbackSrc?: string;
  /**
   * Accessible description of the image (also shown inside the gradient placeholder on load error, never raw file names).
   */
  alt: string;
  /**
   * Explicit width in pixels to prevent layout shift.
   */
  width: number;
  /**
   * Explicit height in pixels to prevent layout shift.
   */
  height: number;
  /**
   * Set to true ONLY for the hero image to use loading="eager". Defaults to false (loading="lazy").
   */
  priority?: boolean;
  /**
   * Optional custom className applied to the outer <picture> or fallback container.
   */
  pictureClassName?: string;
  /**
   * Optional custom gradient background for the error placeholder.
   */
  placeholderGradient?: string;
  /**
   * Optional ref forwarded to the underlying <img> element.
   */
  imgRef?: React.Ref<HTMLImageElement>;
}

function resolveSources(
  src: string,
  webpSrc?: string,
  fallbackSrc?: string
): { webp: string | null; fallback: string; isSvg: boolean } {
  const cleanSrc = src.trim();
  if (/\.svg(\?.*)?$/i.test(cleanSrc)) {
    return { webp: null, fallback: cleanSrc, isSvg: true };
  }

  if (webpSrc && fallbackSrc) {
    return { webp: webpSrc, fallback: fallbackSrc, isSvg: false };
  }

  if (/\.webp(\?.*)?$/i.test(cleanSrc)) {
    const derivedFallback =
      fallbackSrc || cleanSrc.replace(/\.webp(\?.*)?$/i, '.png$1');
    return {
      webp: webpSrc || cleanSrc,
      fallback: derivedFallback,
      isSvg: false,
    };
  }

  if (/\.(png|jpe?g)(\?.*)?$/i.test(cleanSrc)) {
    const derivedWebp =
      webpSrc || cleanSrc.replace(/\.(png|jpe?g)(\?.*)?$/i, '.webp$2');
    return {
      webp: derivedWebp,
      fallback: fallbackSrc || cleanSrc,
      isSvg: false,
    };
  }

  return {
    webp: webpSrc || null,
    fallback: fallbackSrc || cleanSrc,
    isSvg: false,
  };
}

/**
 * SafeImage:
 * Renders a <picture> with a WebP <source> and a PNG/JPG <img> fallback,
 * explicit width & height, loading="lazy" (or "eager" when priority/hero),
 * and decoding="async".
 * On load error, renders a luxury dark-mode gradient placeholder displaying the alt text
 * (never a broken image icon or raw filename).
 */
export function SafeImage({
  src,
  webpSrc,
  fallbackSrc,
  alt,
  width,
  height,
  priority = false,
  loading,
  decoding = 'async',
  className = '',
  pictureClassName = 'block w-full h-full',
  placeholderGradient = 'linear-gradient(135deg, #0D1B3E 0%, #1E295B 50%, #3A2463 100%)',
  imgRef,
  onError,
  ...rest
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const { webp, fallback, isSvg } = resolveSources(src, webpSrc, fallbackSrc);
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(e);
  };

  if (hasError) {
    const readableLabel =
      alt && alt.trim().length > 0 ? alt.trim() : 'ORION Visual Preview';
    return (
      <div
        role="img"
        aria-label={readableLabel}
        style={{
          background: placeholderGradient,
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
        className={`relative flex flex-col items-center justify-center p-6 text-center overflow-hidden select-none ${className}`}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
          aria-hidden="true"
        />
        <span className="relative z-10 font-mono-label text-[10px] tracking-[0.16em] uppercase text-[#2F6BFF] mb-2 px-3 py-1 rounded-full bg-[#050816]/60 border border-white/10">
          ORION IT SOLUTIONS
        </span>
        <span className="relative z-10 font-display font-bold text-sm sm:text-base text-[#F5F7FF] max-w-md leading-snug">
          {readableLabel}
        </span>
      </div>
    );
  }

  return (
    <picture className={pictureClassName}>
      {!isSvg && webp && <source srcSet={webp} type="image/webp" />}
      <img
        ref={imgRef}
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading={resolvedLoading}
        decoding={decoding}
        referrerPolicy="no-referrer"
        onError={handleError}
        className={className}
        {...rest}
      />
    </picture>
  );
}

export default SafeImage;
