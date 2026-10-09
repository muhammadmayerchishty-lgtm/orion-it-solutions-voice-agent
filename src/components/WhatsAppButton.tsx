import { WHATSAPP_APPOINTMENT_URL } from '../sections/ContactSection';

/**
 * Sticky floating WhatsApp circle button bottom-right wired directly to WhatsApp booking link.
 */
export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Subtle hover label */}
      <span className="mr-3 px-3.5 py-1.5 rounded-full bg-[#050816]/90 border border-[rgba(255,255,255,0.1)] backdrop-blur-xl font-mono-label text-[10px] text-[#F5F7FF] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block shadow-lg">
        BOOK ON WHATSAPP
      </span>

      <a
        href={WHATSAPP_APPOINTMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book an appointment with Orion IT Solutions on WhatsApp"
        data-cursor-hover="true"
        className="relative w-13 h-13 md:w-14 md:h-14 rounded-full overflow-hidden flex items-center justify-center bg-[#0B122C]/85 border border-[rgba(255,255,255,0.14)] backdrop-blur-xl text-[#F5F7FF] shadow-[0_0_12px_rgba(34,197,94,0.24),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-[#22C55E]/60 hover:shadow-[0_0_16px_rgba(34,197,94,0.42)] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {/* Subtle pulse ring contained inside button box */}
        <span
          className="absolute inset-0 rounded-full border border-[#22C55E]/40 animate-pulse opacity-40 pointer-events-none"
          style={{ animationDuration: '2.5s' }}
          aria-hidden="true"
        />

        {/* WhatsApp Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="currentColor"
          className="text-[#22C55E] transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.156-1.359c1.484.813 3.172 1.25 4.875 1.25 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.828 14.125c-.25.703-1.438 1.344-2.016 1.422-.531.078-1.219.109-1.969-.125-.453-.141-1.047-.344-1.797-.672-3.156-1.359-5.219-4.547-5.375-4.75-.156-.203-1.281-1.703-1.281-3.25s.813-2.313 1.109-2.625c.297-.313.641-.391.859-.391.219 0 .422.016.609.016.188 0 .453-.078.703.531.266.625.891 2.172.969 2.328.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.141.141-.297.297-.125.594.172.297.766 1.266 1.641 2.047 1.125 1.016 2.078 1.328 2.375 1.484.297.156.469.125.641-.078.172-.203.75-.875.953-1.172.203-.297.406-.25.672-.156.266.094 1.703.813 1.984.953.297.141.484.219.563.344.078.125.078.719-.172 1.422z" />
        </svg>
      </a>
    </div>
  );
}
