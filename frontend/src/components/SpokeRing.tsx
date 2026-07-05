import type { CSSProperties } from 'react';

/**
 * SpokeRing — the golden strobe fan (brand_assets/styles2/background1.png),
 * a transparent stroboscopic swing ring that turns slowly behind the dark
 * sections. Purely decorative, so aria-hidden; rotation stands down under
 * prefers-reduced-motion via the global motion rules.
 */
interface SpokeRingProps {
  className?: string;
  /** full rotation period, seconds */
  duration?: number;
  /** turn counter-clockwise */
  reverse?: boolean;
}

export default function SpokeRing({ className = '', duration = 60, reverse = false }: SpokeRingProps) {
  return (
    <img
      src="/styles2/background1.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`ring-spin pointer-events-none select-none ${className}`}
      style={
        {
          '--spin-dur': `${duration}s`,
          '--spin-dir': reverse ? 'reverse' : 'normal',
        } as CSSProperties
      }
    />
  );
}
