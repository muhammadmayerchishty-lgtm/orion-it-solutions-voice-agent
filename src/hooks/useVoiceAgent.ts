import { useCallback, useEffect, useRef, useState } from 'react';
import { aiConfig, VAPI_ASSISTANT_ID, VAPI_PUBLIC_KEY } from '../lib/aiConfig';
import type { VoiceAgentController, VoiceAgentStatus } from '../types/ai';

interface VapiClientHandle {
  start: (assistantId: string) => Promise<unknown>;
  stop: () => Promise<void> | void;
  setMuted: (muted: boolean) => void;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  removeAllListeners?: () => void;
}

const NON_CRITICAL_VAPI_ERROR_TYPES = new Set([
  'audio-processing-setup-error',
  'audio-processor-recovery-error',
  'audio-observer-setup-error',
  'video-recording-setup-error',
  'local-audio-level-observer-error',
]);

function extractVapiErrorDetails(err: unknown): { message: string; isMicError: boolean } {
  if (!err) {
    return {
      message: 'Could not connect to Hazel voice assistant.',
      isMicError: false,
    };
  }

  let rawMessage = '';
  if (typeof err === 'string') {
    rawMessage = err;
  } else if (err instanceof Error) {
    rawMessage = err.message;
  } else if (typeof err === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = err as Record<string, any>;
    rawMessage =
      (typeof obj.message === 'string' && obj.message.trim()) ||
      (typeof obj.error?.message === 'string' && obj.error.message.trim()) ||
      (typeof obj.error?.error?.message === 'string' && obj.error.error.message.trim()) ||
      (typeof obj.error?.errorMsg === 'string' && obj.error.errorMsg.trim()) ||
      (typeof obj.errorMsg === 'string' && obj.errorMsg.trim()) ||
      (typeof obj.error?.errorDetail === 'string' && obj.error.errorDetail.trim()) ||
      (typeof obj.error === 'string' && obj.error.trim()) ||
      '';
  }

  const lower = rawMessage.toLowerCase();
  const isMicError =
    lower.includes('permission') ||
    lower.includes('notallowed') ||
    lower.includes('not allowed') ||
    lower.includes('denied') ||
    lower.includes('microphone') ||
    lower.includes('audio input') ||
    lower.includes('getusermedia');

  return {
    message: rawMessage || 'Could not connect to Hazel voice assistant.',
    isMicError,
  };
}

/**
 * Vapi Voice Agent hook for Hazel AI Receptionist.
 * Dynamically imports `@vapi-ai/web` only when the user clicks the voice button,
 * keeping the initial bundle light and preserving 60fps scroll performance.
 */
export function useVoiceAgent(onCallStarted?: () => void): VoiceAgentController {
  const [status, setStatus] = useState<VoiceAgentStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isMicDenied, setIsMicDenied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const vapiRef = useRef<VapiClientHandle | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const isConnectingOrActiveRef = useRef<boolean>(false);
  const onCallStartedRef = useRef<(() => void) | undefined>(onCallStarted);
  onCallStartedRef.current = onCallStarted;

  const isDemoMode = !aiConfig.isVoiceConfigured;
  const provider = 'vapi' as const;

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setDuration(0);
    timerIntervalRef.current = window.setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, [clearTimer]);

  const stop = useCallback(async () => {
    clearTimer();
    isConnectingOrActiveRef.current = false;

    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
      }
    } catch (err) {
      console.error('[Hazel Vapi Stop Error]:', err);
    }

    setIsSpeaking(false);
    setIsMuted(false);
    setVolumeLevel(0);
    setStatus((prev) => (prev === 'idle' || prev === 'error' ? prev : 'ended'));
  }, [clearTimer]);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setStatus('error');
      setIsMicDenied(true);
      setError('Microphone access requires a secure connection (HTTPS or localhost).');
      return false;
    }

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setStatus('error');
      setIsMicDenied(true);
      setError('Microphone access is not supported in this browser.');
      return false;
    }

    setStatus('requesting-mic');
    setIsMicDenied(false);

    try {
      // Request microphone stream directly inside the user click gesture flow
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      // Immediately release pre-check tracks so Vapi / Daily WebRTC claims the mic without lock conflict
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: unknown) {
      console.error('[Hazel Microphone Permission Error]:', err);
      const domErrName =
        err && typeof err === 'object' && 'name' in err && typeof err.name === 'string'
          ? err.name
          : '';
      const domErrMsg =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message.toLowerCase()
          : '';

      setStatus('error');

      if (domErrName === 'NotFoundError' || domErrName === 'DevicesNotFoundError') {
        setIsMicDenied(false);
        setError('No microphone was found. Please connect a microphone or headset and try again.');
      } else if (domErrName === 'NotReadableError' || domErrName === 'TrackStartError') {
        setIsMicDenied(false);
        setError(
          'Your microphone is currently in use by another app. Close other audio apps and try again.'
        );
      } else if (
        domErrName === 'NotAllowedError' ||
        domErrName === 'PermissionDeniedError' ||
        domErrName === 'SecurityError' ||
        domErrMsg.includes('permission') ||
        domErrMsg.includes('denied')
      ) {
        setIsMicDenied(true);
        setError(
          'Microphone permission was denied. Click the lock/settings icon in your browser address bar, set Microphone to Allow, and tap Try Again.'
        );
      } else {
        setIsMicDenied(true);
        setError(
          'Microphone access was blocked. Please allow microphone permission in your browser settings and tap Try Again.'
        );
      }
      return false;
    }
  };

  const getOrCreateVapiSingleton = useCallback(async (): Promise<VapiClientHandle> => {
    if (vapiRef.current) {
      return vapiRef.current;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import('@vapi-ai/web');
    const VapiCtor = mod?.default?.default ?? mod?.default ?? mod?.Vapi ?? mod;
    if (typeof VapiCtor !== 'function') {
      throw new Error('Vapi SDK failed to load (constructor not found)');
    }

    const vapi: VapiClientHandle = new VapiCtor(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setIsMicDenied(false);
      setError(null);
      setStatus('listening');
      startTimer();
      onCallStartedRef.current?.();
    });

    vapi.on('speech-start', () => {
      setIsSpeaking(true);
      setStatus('speaking');
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
      setVolumeLevel(0);
      setStatus('listening');
    });

    vapi.on('volume-level', (level: unknown) => {
      if (typeof level === 'number' && Number.isFinite(level)) {
        const clamped = Math.max(0, Math.min(1, level));
        setVolumeLevel(clamped);
      }
    });

    vapi.on('call-end', () => {
      clearTimer();
      isConnectingOrActiveRef.current = false;
      setIsSpeaking(false);
      setIsMuted(false);
      setVolumeLevel(0);
      setStatus((prev) => (prev === 'error' ? 'error' : 'ended'));
    });

    vapi.on('camera-error', (err: unknown) => {
      console.error('[Hazel Vapi Camera/Mic Error]:', err);
      clearTimer();
      isConnectingOrActiveRef.current = false;
      setIsSpeaking(false);
      setVolumeLevel(0);
      setIsMicDenied(true);
      setStatus('error');
      const details = extractVapiErrorDetails(err);
      setError(details.message);
    });

    vapi.on('error', (err: unknown) => {
      const errType =
        err && typeof err === 'object' && 'type' in err && typeof err.type === 'string'
          ? err.type
          : '';

      if (errType && NON_CRITICAL_VAPI_ERROR_TYPES.has(errType)) {
        console.warn('[Hazel Vapi non-critical audio warning]:', err);
        return;
      }

      console.error('[Hazel Vapi Error]:', err);
      clearTimer();
      isConnectingOrActiveRef.current = false;
      setIsSpeaking(false);
      setVolumeLevel(0);
      const details = extractVapiErrorDetails(err);
      setIsMicDenied(details.isMicError);
      setStatus('error');
      setError(details.message);
    });

    return vapi;
  }, [clearTimer, startTimer]);

  const preload = useCallback(() => {
    void getOrCreateVapiSingleton().catch((err) => {
      console.error('[Hazel Vapi Preload Error]:', err);
    });
  }, [getOrCreateVapiSingleton]);

  const start = useCallback(async () => {
    const resolvedPublicKey = aiConfig.vapiPublicKey || VAPI_PUBLIC_KEY;
    const resolvedAssistantId = aiConfig.vapiAssistantId || VAPI_ASSISTANT_ID;

    if (isDemoMode || !resolvedPublicKey || !resolvedAssistantId) {
      setError(null);
      setStatus('idle');
      return;
    }

    if (isConnectingOrActiveRef.current) {
      return;
    }

    setError(null);
    setIsMicDenied(false);
    setIsMuted(false);
    setIsSpeaking(false);
    setVolumeLevel(0);
    setDuration(0);

    // Only call vapi.start(VAPI_ASSISTANT_ID) after the microphone check passes
    const micGranted = await requestMicrophonePermission();
    if (!micGranted) {
      return;
    }

    isConnectingOrActiveRef.current = true;
    setStatus('connecting');

    try {
      const vapi = await getOrCreateVapiSingleton();
      const callResult = await vapi.start(VAPI_ASSISTANT_ID);
      if (!callResult && isConnectingOrActiveRef.current) {
        isConnectingOrActiveRef.current = false;
      }
    } catch (err: unknown) {
      console.error('[Hazel Vapi Start Error]:', err);
      clearTimer();
      isConnectingOrActiveRef.current = false;
      const details = extractVapiErrorDetails(err);
      setIsMicDenied(details.isMicError);
      setStatus('error');
      setError(details.message);
    }
  }, [clearTimer, getOrCreateVapiSingleton, isDemoMode]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        if (vapiRef.current) {
          vapiRef.current.setMuted(next);
        }
      } catch (err) {
        console.error('[Hazel Vapi Mute Error]:', err);
      }
      return next;
    });
  }, []);

  // Clean up active Vapi session on unmount or when tab/window closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (vapiRef.current) {
        try {
          void vapiRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimer();
      if (vapiRef.current) {
        try {
          void vapiRef.current.stop();
          vapiRef.current.removeAllListeners?.();
        } catch {
          // Ignore
        }
        vapiRef.current = null;
      }
    };
  }, [clearTimer]);

  return {
    start,
    stop,
    toggleMute,
    preload,
    status,
    isSpeaking,
    isMuted,
    volumeLevel,
    isMicDenied,
    error,
    duration,
    isDemoMode,
    provider,
  };
}

