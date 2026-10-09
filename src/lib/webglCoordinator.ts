import { useEffect, useState } from 'react';

/**
 * Coordinates WebGL canvases so that AT MOST ONE WebGL canvas renders at any time.
 * When HeroOrionScene is visible in the viewport, it holds priority ('hero').
 * When HeroOrionScene scrolls offscreen, StarfieldCanvas is allowed to render ('starfield').
 */
type CanvasSlot = 'hero' | 'starfield';

let heroVisible = true;
const listeners = new Set<() => void>();

export function setHeroCanvasVisible(visible: boolean): void {
  if (heroVisible === visible) return;
  heroVisible = visible;
  listeners.forEach((fn) => fn());
}

export function getActiveCanvasSlot(): CanvasSlot {
  return heroVisible ? 'hero' : 'starfield';
}

export function useActiveCanvasSlot(): CanvasSlot {
  const [slot, setSlot] = useState<CanvasSlot>(() => getActiveCanvasSlot());

  useEffect(() => {
    const update = () => setSlot(getActiveCanvasSlot());
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return slot;
}
