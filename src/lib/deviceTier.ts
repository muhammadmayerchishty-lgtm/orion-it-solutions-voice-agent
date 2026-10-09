import { useEffect, useState } from 'react';

export type DeviceTier = 'low' | 'mid' | 'high';

const TIER_ORDER: DeviceTier[] = ['low', 'mid', 'high'];

let currentTier: DeviceTier | null = null;
let watchdogStarted = false;
const listeners = new Set<(tier: DeviceTier) => void>();

function hasWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function detectInitialDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'high';

  // 1. Allow ?tier=low|mid|high in the URL for testing
  try {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('tier')?.toLowerCase();
    if (forced === 'low' || forced === 'mid' || forced === 'high') {
      return forced;
    }
  } catch {
    // ignore URL parsing errors
  }

  // 2. Check WebGL availability
  if (!hasWebGLSupport()) {
    return 'low';
  }

  // 3. Check prefers-reduced-motion
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 'low';
  }

  // 4. Check navigator.connection.saveData
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) {
    return 'low';
  }

  // 5. Check deviceMemory <= 4
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) {
    return 'low';
  }

  // 6. Check hardwareConcurrency <= 4 ("low") or <= 8 ("mid")
  const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 8;
  if (cores <= 4) {
    return 'low';
  }
  if (cores <= 8) {
    return 'mid';
  }

  return 'high';
}

function applyTierAttribute(tier: DeviceTier) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-device-tier', tier);
  }
}

export function getDeviceTier(): DeviceTier {
  if (currentTier === null) {
    currentTier = detectInitialDeviceTier();
    applyTierAttribute(currentTier);
    startFpsWatchdog();
  }
  return currentTier;
}

export function setDeviceTier(nextTier: DeviceTier): void {
  if (currentTier === nextTier) return;
  currentTier = nextTier;
  applyTierAttribute(nextTier);
  listeners.forEach((listener) => listener(nextTier));
}

export function subscribeDeviceTier(listener: (tier: DeviceTier) => void): () => void {
  // Ensure initialized
  getDeviceTier();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * FPS Watchdog:
 * If the average FPS stays under 40 for 3 consecutive seconds while the tab is visible,
 * drop one tier automatically (high -> mid -> low).
 */
export function startFpsWatchdog(): void {
  if (watchdogStarted || typeof window === 'undefined') return;
  watchdogStarted = true;

  let frameCount = 0;
  let windowStart = performance.now();
  let lowFpsSeconds = 0;

  const tick = (now: number) => {
    if (document.hidden) {
      frameCount = 0;
      windowStart = now;
      lowFpsSeconds = 0;
    } else {
      frameCount += 1;
      const elapsed = now - windowStart;

      if (elapsed >= 1000) {
        const avgFps = (frameCount * 1000) / elapsed;
        frameCount = 0;
        windowStart = now;

        if (avgFps < 40) {
          lowFpsSeconds += 1;
          if (lowFpsSeconds >= 3) {
            lowFpsSeconds = 0;
            const tier = getDeviceTier();
            const idx = TIER_ORDER.indexOf(tier);
            if (idx > 0) {
              const downgraded = TIER_ORDER[idx - 1];
              setDeviceTier(downgraded);
            }
          }
        } else {
          lowFpsSeconds = 0;
        }
      }
    }

    if (getDeviceTier() !== 'low') {
      requestAnimationFrame(tick);
    } else {
      watchdogStarted = false;
    }
  };

  if (getDeviceTier() !== 'low') {
    requestAnimationFrame(tick);
  } else {
    watchdogStarted = false;
  }
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(() => getDeviceTier());

  useEffect(() => {
    const initial = getDeviceTier();
    setTier(initial);
    return subscribeDeviceTier((updated) => {
      setTier(updated);
    });
  }, []);

  return tier;
}
