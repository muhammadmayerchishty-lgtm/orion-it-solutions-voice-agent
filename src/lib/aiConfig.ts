import type { VoiceProviderType } from '../types/ai';

// ============================================================================
// HAZEL VOICE AGENT (VAPI) — PUBLIC KEY & ASSISTANT ID
// Only the PUBLIC key is ever used in the frontend. Never use a private key.
// ============================================================================
export const VAPI_PUBLIC_KEY = "69a43754-fb90-46ad-a47f-23b1cac51f6d";
export const VAPI_ASSISTANT_ID = "2013e485-aded-4cee-97eb-e4da614cb99b";

export interface AiConfig {
  voiceProvider: VoiceProviderType;
  vapiPublicKey: string;
  vapiAssistantId: string;
  makeWebhookUrl: string;
  whatsappNumber: string;
  whatsappUrl: string;
  isVoiceConfigured: boolean;
  isChatWebhookConfigured: boolean;
}

function readEnvString(key: string, fallback = ''): string {
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env;
    const raw = env?.[key];
    return typeof raw === 'string' ? raw.trim() : fallback;
  } catch {
    return fallback;
  }
}

function sanitizeVapiValue(value: string): string {
  if (!value) return '';
  return value
    .replace(/<PASTE_[^>]*>/gi, '')
    .replace(/^<+|>+$/g, '')
    .trim();
}

function isConfiguredValue(value: string): boolean {
  const normalized = sanitizeVapiValue(value);
  if (!normalized || normalized === 'undefined' || normalized === 'null') return false;
  if (normalized.includes('PASTE_') || normalized.includes('YOUR_')) return false;
  return true;
}

const envVapiPublicKey = sanitizeVapiValue(readEnvString('VITE_VAPI_PUBLIC_KEY', ''));
const envVapiAssistantId = sanitizeVapiValue(readEnvString('VITE_VAPI_ASSISTANT_ID', ''));

const vapiPublicKey = isConfiguredValue(envVapiPublicKey)
  ? envVapiPublicKey
  : sanitizeVapiValue(VAPI_PUBLIC_KEY);

const vapiAssistantId = isConfiguredValue(envVapiAssistantId)
  ? envVapiAssistantId
  : sanitizeVapiValue(VAPI_ASSISTANT_ID);

const makeWebhookUrl = readEnvString('VITE_MAKE_WEBHOOK_URL', '');
const whatsappNumber = readEnvString('VITE_WHATSAPP_NUMBER', '923164338095') || '923164338095';

const isVoiceConfigured =
  isConfiguredValue(vapiPublicKey) && isConfiguredValue(vapiAssistantId);

const isChatWebhookConfigured = Boolean(
  makeWebhookUrl &&
    makeWebhookUrl.startsWith('http') &&
    !makeWebhookUrl.includes('YOUR_WEBHOOK_ID')
);

export const aiConfig: AiConfig = {
  voiceProvider: 'vapi',
  vapiPublicKey,
  vapiAssistantId,
  makeWebhookUrl,
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  isVoiceConfigured,
  isChatWebhookConfigured,
};
