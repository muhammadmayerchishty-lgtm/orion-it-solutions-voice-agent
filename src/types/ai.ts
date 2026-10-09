export type VoiceProviderType = 'vapi';

export type VoiceAgentStatus =
  | 'idle'
  | 'requesting-mic'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'error'
  | 'ended';

export interface VoiceAgentController {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  toggleMute: () => void;
  preload: () => void;
  status: VoiceAgentStatus;
  isSpeaking: boolean;
  isMuted: boolean;
  volumeLevel: number;
  isMicDenied: boolean;
  error: string | null;
  duration: number;
  isDemoMode: boolean;
  provider: VoiceProviderType;
}

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO 8601
  status: ChatMessageStatus;
}

export interface MakeWebhookRequestPayload {
  message: string;
  timestamp: string;
  sessionId: string;
  source: 'orion-website-chat';
  pageUrl: string;
  userAgent: string;
}

export interface MakeWebhookResponsePayload {
  reply?: string;
}
