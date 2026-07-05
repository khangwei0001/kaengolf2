import { useEffect, useRef } from 'react';

/**
 * Embers — the brand's ambient signature made kinetic.
 * A sparse field of forge sparks drifts upward with a slow sway and a
 * breath-like flicker, echoing 炎. Rendered to a canvas so it stays cheap:
 * it pauses when the tab is hidden and stands down entirely under
 * prefers-reduced-motion. Purely decorative, so aria-hidden.
 */
interface EmbersProps {
  /** how many sparks live at once; scaled down on narrow viewports */
  count?: number;
  className?: string;
}

type Spark = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  max: number;
  color: string;
  sway: number;
  phase: number;
  glow: number;
  bright: number;
};

const COLORS = ['#FF4D17', '#FF8A3D', '#C81E07'];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Embers({ count = 16, className = '' }: EmbersProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Fewer, calmer sparks on phones so it reads as atmosphere, not confetti.
    const n = w < 640 ? Math.round(count * 0.6) : count;

    const spawn = (fromBottom = false): Spark => {
      // roughly one spark in four is a larger, brighter, slower-rising ember
      const big = Math.random() < 0.26;
      const max = rand(4200, 9500);
      return {
        x: rand(0, w),
        y: fromBottom ? h + rand(4, 40) : rand(h * 0.15, h + 20),
        r: big ? rand(2.6, 4.3) : rand(0.8, 2.4),
        vy: (big ? rand(5, 11) : rand(8, 18)) / 1000, // px per ms, upward
        vx: rand(-2.2, 2.2) / 1000,
        life: fromBottom ? 0 : rand(0, max * 0.7),
        max,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        sway: rand(5, 16),
        phase: rand(0, Math.PI * 2),
        glow: big ? rand(11, 16) : rand(6, 9),
        bright: big ? 1 : rand(0.8, 1),
      };
    };

    let sparks: Spark[] = Array.from({ length: n }, () => spawn(false));

    const frame = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < sparks.length; i++) {
        const p = sparks[i];
        p.life += dt;
        p.y -= p.vy * dt;
        p.x += p.vx * dt + Math.sin(p.life / 700 + p.phase) * (p.sway / 1400) * dt;

        const t = p.life / p.max;
        if (t >= 1 || p.y < -12) {
          sparks[i] = spawn(true);
          continue;
        }

        // fade in, hold, fade out; a subtle flicker rides on top
        const envelope = Math.sin(Math.min(t, 1) * Math.PI);
        const flicker = 0.72 + 0.28 * Math.sin(p.life / 85 + p.phase);
        ctx.globalAlpha = Math.max(0, envelope * flicker * p.bright);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      resize();
      sparks = Array.from({ length: w < 640 ? Math.round(count * 0.6) : count }, () =>
        spawn(false),
      );
    });
    ro.observe(parent);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
