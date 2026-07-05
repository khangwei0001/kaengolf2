import { useEffect, useRef } from 'react';

/**
 * CursorGlow — a faint ember flame that trails the pointer across its section.
 * The outer node is moved to the cursor with an eased follow (rAF lerp); the
 * inner core carries the blurred radial glow and a slow flicker, screen-blended
 * so it reads as light on the dark surface. It listens on its parent section,
 * fades in/out with enter/leave, and stays dark under prefers-reduced-motion
 * (and on touch, where no pointer moves).
 */
export default function CursorGlow({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (!visible) {
        visible = true;
        cx = tx;
        cy = ty;
        el.style.opacity = '1';
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = '0';
    };

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`cursor-glow ${className}`} aria-hidden="true">
      <div className="cursor-glow-core" />
    </div>
  );
}
