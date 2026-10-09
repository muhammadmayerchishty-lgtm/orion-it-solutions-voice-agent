import { aiConfig } from './aiConfig';
import type { MakeWebhookRequestPayload, MakeWebhookResponsePayload } from '../types/ai';

// TODO: Replace with the real Make.com webhook once the automation is final.
export const MAKE_WEBHOOK_PLACEHOLDER_URL =
  aiConfig.makeWebhookUrl || 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID';

const REQUEST_TIMEOUT_MS = 20_000;
const EMPTY_REPLY_FALLBACK =
  'Thanks! Our team has received your message and will reply shortly.';
const DEMO_REPLY_FALLBACK =
  'Thanks for your message! Our automation is being finalised. Meanwhile you can book directly on WhatsApp.';

let hasLoggedDemoInfo = false;

function getContextualDemoReply(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes('service')) {
    return 'We craft premium websites, UI/UX design systems, brand identities, interactive portfolios, and 24/7 AI voice & workflow automations. Thanks for your message! Our automation is being finalised. Meanwhile you can book directly on WhatsApp.';
  }
  if (lower.includes('architect') || lower.includes('interior')) {
    return 'Architecture & interior design studios are our flagship speciality — we build spatial project showcases, interactive monographs, and private consultation funnels. Thanks for your message! Our automation is being finalised. Meanwhile you can book directly on WhatsApp.';
  }
  if (lower.includes('voice') || lower.includes('hazel') || lower.includes('ai')) {
    return 'Our AI Voice Receptionists answer incoming calls 24/7, qualify leads, and dispatch instant summaries to your WhatsApp and Gmail. Thanks for your message! Our automation is being finalised. Meanwhile you can book directly on WhatsApp.';
  }
  if (lower.includes('book') || lower.includes('appointment') || lower.includes('price')) {
    return 'We would love to schedule a consultation with Muhammad Mayer Chishty. Thanks for your message! Our automation is being finalised. Meanwhile you can book directly on WhatsApp.';
  }
  return DEMO_REPLY_FALLBACK;
}

export async function sendChatToWebhook(
  payload: MakeWebhookRequestPayload
): Promise<{ reply: string; isDemo: boolean }> {
  const webhookUrl = aiConfig.makeWebhookUrl;
  const isDemoMode =
    !webhookUrl ||
    !webhookUrl.startsWith('http') ||
    webhookUrl.includes('YOUR_WEBHOOK_ID');

  if (isDemoMode) {
    if (!hasLoggedDemoInfo) {
      console.info(
        '[ORION AI Chat] VITE_MAKE_WEBHOOK_URL is not configured yet. Running in Demo Mode.'
      );
      hasLoggedDemoInfo = true;
    }
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 900);
    });
    return {
      reply: getContextualDemoReply(payload.message),
      isDemo: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with HTTP ${response.status}`);
    }

    const rawBody = await response.text();
    const trimmedBody = rawBody.trim();

    if (!trimmedBody) {
      return { reply: EMPTY_REPLY_FALLBACK, isDemo: false };
    }

    try {
      const parsed = JSON.parse(trimmedBody) as MakeWebhookResponsePayload;
      if (parsed && typeof parsed.reply === 'string' && parsed.reply.trim().length > 0) {
        return { reply: parsed.reply.trim(), isDemo: false };
      }
      if (parsed && typeof parsed.reply === 'string' && parsed.reply.trim().length === 0) {
        return { reply: EMPTY_REPLY_FALLBACK, isDemo: false };
      }
    } catch {
      // Plain-text response body is accepted directly when not valid JSON
    }

    if (trimmedBody.toLowerCase() === 'accepted') {
      return { reply: EMPTY_REPLY_FALLBACK, isDemo: false };
    }

    return { reply: trimmedBody, isDemo: false };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
