import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import {
  useChat,
  QUICK_REPLY_CHIPS,
  MAX_CHAT_MESSAGE_LENGTH,
} from '../../hooks/useChat';
import { aiConfig } from '../../lib/aiConfig';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const { messages, isSending, sendMessage, retryMessage } = useChat();
  const [inputValue, setInputValue] = useState<string>('');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Auto-resize textarea up to 4 lines (~96px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 96; // ~4 lines
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [inputValue]);

  // Track whether user is near bottom of message list
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 80;
  };

  // Auto-scroll to newest message if user hasn't scrolled up
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isNearBottomRef.current) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [messages, isSending, isOpen, reducedMotion]);

  // Escape key & Focus Trap inside drawer when open
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 80);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;
    isNearBottomRef.current = true;
    setInputValue('');
    await sendMessage(trimmed);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const handleQuickReply = async (chipText: string) => {
    if (isSending) return;
    isNearBottomRef.current = true;
    await sendMessage(chipText);
  };

  const charsLength = inputValue.length;
  const showCharCounter = charsLength >= 800;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[48] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="orion-ai-drawer-title"
        >
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.05 : 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050816]/60 backdrop-blur-[4px]"
            aria-hidden="true"
          />

          {/* Slide-in Right Drawer (420px on desktop, full-screen on mobile) */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={
              reducedMotion
                ? { duration: 0.05 }
                : { type: 'spring', duration: 0.35, bounce: 0.08 }
            }
            style={{
              backgroundColor: 'rgba(8, 12, 32, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            className="relative z-10 w-full sm:w-[420px] h-full border-l border-[rgba(255,255,255,0.08)] flex flex-col justify-between overflow-hidden shadow-[0_0_60px_rgba(2,4,14,0.9)]"
          >
            {/* Subtle Blue-Violet Radial Glow at Top */}
            <div
              className="absolute top-0 inset-x-0 h-44 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(47, 107, 255, 0.22) 0%, rgba(123, 77, 255, 0.12) 48%, transparent 78%)',
              }}
              aria-hidden="true"
            />

            {/* HEADER */}
            <div className="relative z-10 px-5 py-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/images/orion-logo.svg"
                  alt="ORION AI"
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="w-9 h-9 object-contain shrink-0"
                />
                <div className="min-w-0">
                  <h2
                    id="orion-ai-drawer-title"
                    className="font-display font-bold text-[15px] tracking-wider uppercase text-[#F5F7FF] leading-tight"
                  >
                    ORION AI
                  </h2>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
                    </span>
                    <span className="font-mono-label text-[9.5px] text-[#8B93B7] truncate">
                      ONLINE • TYPICALLY REPLIES IN SECONDS
                    </span>
                  </div>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close ORION AI chat drawer"
                data-cursor-hover="true"
                className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8B93B7] hover:text-[#F5F7FF] hover:border-[#2F6BFF]/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* BODY: Scrollable Message List */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              data-lenis-prevent
              aria-live="polite"
              aria-relevant="additions"
              className="relative z-10 flex-1 overflow-y-auto px-5 py-5 space-y-4"
            >
              {messages.map((msg, index) => (
                <React.Fragment key={msg.id}>
                  <ChatMessage message={msg} onRetry={retryMessage} />

                  {/* Quick-Reply Chips right under the welcome message */}
                  {index === 0 && msg.role === 'assistant' && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      {QUICK_REPLY_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          disabled={isSending}
                          onClick={() => void handleQuickReply(chip)}
                          data-cursor-hover="true"
                          className="px-3.5 py-2 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:border-[#2F6BFF]/50 hover:bg-[#2F6BFF]/12 font-mono-label text-[10px] text-[#F5F7FF] transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {isSending && <TypingIndicator />}
            </div>

            {/* FOOTER: Auto-Growing Textarea + Disclaimer */}
            <div className="relative z-10 px-5 pt-3 pb-4 border-t border-[rgba(255,255,255,0.08)] bg-[#050816]/85 shrink-0">
              <form onSubmit={(e) => void handleSubmit(e)} className="flex items-end gap-2.5">
                <div className="relative flex-1">
                  <label htmlFor="orion-ai-chat-input" className="sr-only">
                    Message ORION AI
                  </label>
                  <textarea
                    id="orion-ai-chat-input"
                    ref={textareaRef}
                    rows={1}
                    maxLength={MAX_CHAT_MESSAGE_LENGTH}
                    value={inputValue}
                    onChange={(e) =>
                      setInputValue(e.target.value.slice(0, MAX_CHAT_MESSAGE_LENGTH))
                    }
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Ask about websites, AI agents, or booking..."
                    className="w-full px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] focus:border-[#2F6BFF] text-[#F5F7FF] placeholder-[#8B93B7]/60 font-body text-[14px] leading-[1.45] resize-none overflow-y-auto focus:outline-none transition-colors"
                  />
                  {showCharCounter && (
                    <span className="absolute right-3 bottom-1.5 font-mono-label text-[9px] text-[#8B93B7]">
                      {charsLength}/{MAX_CHAT_MESSAGE_LENGTH}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSending}
                  aria-label="Send message"
                  data-cursor-hover="true"
                  style={{
                    background: 'linear-gradient(135deg, #2F6BFF 0%, #7B4DFF 100%)',
                  }}
                  className="w-11 h-11 rounded-full text-[#F5F7FF] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(47,107,255,0.45)] disabled:opacity-40 disabled:shadow-none hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>

              <p className="mt-2.5 text-center font-body text-[11.5px] text-[#8B93B7] leading-snug">
                AI responses may be imperfect. For urgent matters use{' '}
                <a
                  href={aiConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22C55E] hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] rounded"
                >
                  WhatsApp
                </a>
                .
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
export default ChatDrawer;
