import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { VoiceAgentButton } from './VoiceAgentButton';

const ChatDrawer = lazy(() => import('./ChatDrawer'));

/**
 * Floating AI Assistant Dock:
 * Stacks vertically ABOVE the existing bottom-right WhatsApp button with 14px gaps:
 *   Top:    Hazel Voice Agent Button (60px, 52px on <380px)
 *   Middle: ORION AI Chat Drawer Button (60px, 52px on <380px)
 *   Bottom: Existing WhatsApp Button (untouched at bottom-6 right-6)
 */
export function AiAssistantDock() {
  const [isLoadingScreenDone, setIsLoadingScreenDone] = useState(false);
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [hasOpenedChatOnce, setHasOpenedChatOnce] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    // Hide the dock while the initial loading screen is visible
    const waitMs = mq.matches ? 400 : 1800;
    const timer = window.setTimeout(() => {
      setIsLoadingScreenDone(true);
    }, waitMs);

    return () => {
      mq.removeEventListener('change', onChange);
      window.clearTimeout(timer);
    };
  }, []);

  // Opening the chat drawer hides the voice panel (without ending any active call)
  const handleOpenChatDrawer = useCallback(() => {
    setHasOpenedChatOnce(true);
    setVoicePanelOpen(false);
    setChatDrawerOpen(true);
  }, []);

  const handleCloseChatDrawer = useCallback(() => {
    setChatDrawerOpen(false);
  }, []);

  const handleToggleVoicePanel = useCallback(() => {
    setVoicePanelOpen((prev) => {
      const next = !prev;
      if (next) {
        setChatDrawerOpen(false);
      }
      return next;
    });
  }, []);

  // Starting a voice call closes the chat drawer
  const handleVoiceCallStarted = useCallback(() => {
    setChatDrawerOpen(false);
  }, []);

  if (!isLoadingScreenDone) {
    return null;
  }

  return (
    <>
      {/* Stacked Floating Column Above Existing WhatsApp Button (24px gap between Voice, Chat, and WhatsApp) */}
      <div
        style={{
          right: 'calc(24px + env(safe-area-inset-right, 0px))',
          bottom: 'calc(24px + 56px + 24px + env(safe-area-inset-bottom, 0px))',
        }}
        className="fixed z-[38] flex flex-col items-end gap-[24px] pointer-events-none"
      >
        {/* TOP: Hazel Voice Agent Button + Anchored Call Panel */}
        <div className="pointer-events-auto">
          <VoiceAgentButton
            isOpen={voicePanelOpen}
            onToggleOpen={handleToggleVoicePanel}
            onClosePanel={() => setVoicePanelOpen(false)}
            onCallStarted={handleVoiceCallStarted}
            entranceDelay={0.18}
          />
        </div>

        {/* MIDDLE: ORION AI Chat Drawer Trigger Button */}
        <div className="relative flex items-center justify-end group/chat pointer-events-auto">
          <span
            role="tooltip"
            className="mr-3 px-3.5 py-1.5 rounded-full bg-[#050816]/90 border border-[rgba(255,255,255,0.1)] backdrop-blur-md font-mono-label text-[10px] text-[#F5F7FF] whitespace-nowrap opacity-0 translate-x-2 group-hover/chat:opacity-100 group-hover/chat:translate-x-0 transition-all duration-200 pointer-events-none hidden sm:inline-block shadow-lg"
          >
            Chat with ORION AI
          </span>

          <motion.button
            type="button"
            onClick={handleOpenChatDrawer}
            aria-label="Chat with ORION AI"
            aria-expanded={chatDrawerOpen}
            data-cursor-hover="true"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              delay: reducedMotion ? 0 : 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={reducedMotion ? undefined : { scale: 1.06 }}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            className="relative w-[60px] h-[60px] max-[379px]:w-[52px] max-[379px]:h-[52px] rounded-full p-[1px] bg-gradient-to-br from-[#2F6BFF] to-[#7B4DFF] shadow-[0_0_12px_rgba(47,107,255,0.28)] hover:shadow-[0_0_16px_rgba(47,107,255,0.5)] transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
          >
            <span className="w-full h-full rounded-full bg-[#080C20]/90 flex items-center justify-center text-[#F5F7FF] relative overflow-hidden">
              <MessageSquare className="w-5 h-5 text-[#F5F7FF]" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#2F6BFF] to-[#7B4DFF] border border-[rgba(255,255,255,0.22)] font-mono-label text-[7.5px] font-bold text-[#F5F7FF] leading-none shadow-[0_0_6px_rgba(47,107,255,0.5)]">
                AI
              </span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* Lazy-Loaded Slide-In AI Chat Drawer */}
      {(hasOpenedChatOnce || chatDrawerOpen) && (
        <Suspense fallback={null}>
          <ChatDrawer isOpen={chatDrawerOpen} onClose={handleCloseChatDrawer} />
        </Suspense>
      )}
    </>
  );
}
export default AiAssistantDock;
