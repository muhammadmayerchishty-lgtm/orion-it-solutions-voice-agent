import { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatToWebhook } from '../lib/chatApi';
import type { ChatMessage, MakeWebhookRequestPayload } from '../types/ai';

const SESSION_ID_STORAGE_KEY = 'orion_ai_chat_session_id';
const MESSAGES_STORAGE_KEY = 'orion_ai_chat_messages_v1';
export const MAX_CHAT_MESSAGE_LENGTH = 1000;

export const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'orion-welcome-msg',
  role: 'assistant',
  content:
    "Hi, I'm ORION AI. I can tell you about our websites, branding and AI automation services, or help you book an appointment. How can I help?",
  timestamp: new Date().toISOString(),
  status: 'sent',
};

export const QUICK_REPLY_CHIPS: readonly string[] = [
  'Our services',
  'Architecture & interior websites',
  'AI voice agents',
  'Book an appointment',
];

function createUuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // Fallback below
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_ID_STORAGE_KEY);
    if (existing && existing.trim().length > 0) {
      return existing;
    }
    const created = createUuid();
    window.sessionStorage.setItem(SESSION_ID_STORAGE_KEY, created);
    return created;
  } catch {
    return createUuid();
  }
}

function loadStoredMessages(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) return [INITIAL_WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [INITIAL_WELCOME_MESSAGE];
    }
    const valid = parsed.filter(
      (item): item is ChatMessage =>
        Boolean(
          item &&
            typeof item === 'object' &&
            typeof (item as ChatMessage).id === 'string' &&
            typeof (item as ChatMessage).content === 'string' &&
            typeof (item as ChatMessage).role === 'string' &&
            typeof (item as ChatMessage).timestamp === 'string'
        )
    );
    return valid.length > 0 ? valid : [INITIAL_WELCOME_MESSAGE];
  } catch {
    return [INITIAL_WELCOME_MESSAGE];
  }
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isSending: boolean;
  sessionId: string;
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredMessages());
  const [isSending, setIsSending] = useState<boolean>(false);
  const inFlightRef = useRef<boolean>(false);

  // Persist conversation to sessionStorage safely
  useEffect(() => {
    try {
      window.sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage quota or private mode errors
    }
  }, [messages]);

  const dispatchToWebhook = useCallback(
    async (userMsgId: string, textToSend: string, timestampIso: string) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setIsSending(true);

      const payload: MakeWebhookRequestPayload = {
        message: textToSend,
        timestamp: timestampIso,
        sessionId,
        source: 'orion-website-chat',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      };

      try {
        const { reply } = await sendChatToWebhook(payload);

        const assistantMessage: ChatMessage = {
          id: createUuid(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          status: 'sent',
        };

        setMessages((prev) =>
          prev
            .map((m) => (m.id === userMsgId ? { ...m, status: 'sent' as const } : m))
            .concat(assistantMessage)
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsgId ? { ...m, status: 'error' as const } : m))
        );
      } finally {
        inFlightRef.current = false;
        setIsSending(false);
      }
    },
    [sessionId]
  );

  const sendMessage = useCallback(
    async (rawContent: string) => {
      if (inFlightRef.current) return;
      const trimmed = rawContent.trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
      if (!trimmed) return;

      const timestampIso = new Date().toISOString();
      const userMsgId = createUuid();

      const optimisticUserMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        timestamp: timestampIso,
        status: 'sending',
      };

      setMessages((prev) => [...prev, optimisticUserMessage]);
      await dispatchToWebhook(userMsgId, trimmed, timestampIso);
    },
    [dispatchToWebhook]
  );

  const retryMessage = useCallback(
    async (messageId: string) => {
      if (inFlightRef.current) return;
      const target = messages.find((m) => m.id === messageId && m.role === 'user');
      if (!target) return;

      const updatedTimestamp = new Date().toISOString();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, status: 'sending' as const, timestamp: updatedTimestamp }
            : m
        )
      );

      await dispatchToWebhook(messageId, target.content, updatedTimestamp);
    },
    [messages, dispatchToWebhook]
  );

  return {
    messages,
    isSending,
    sessionId,
    sendMessage,
    retryMessage,
  };
}
