import { useEffect, useRef, useState } from 'react';

/**
 * TypeOnce — types a fixed string out a single time, then rests. Unlike the
 * looping Typewriter, this suits body copy. It reserves its final wrapped size
 * with a hidden ghost so the paragraph never reflows while typing, and can be
 * driven by an external `start` flag so several instances begin in unison.
 * Under prefers-reduced-motion it shows the full text at once.
 */
interface TypeOnceProps {
  text: string;
  className?: string;
  /** milliseconds per character */
  speed?: number;
  /** externally-controlled start; when omitted, it starts itself on scroll-in */
  start?: boolean;
}

export default function TypeOnce({ text, className = '', speed = 16, start }: TypeOnceProps) {
  const controlled = start !== undefined;
  const [count, setCount] = useState(0);
  const [selfStart, setSelfStart] = useState(false);
  const reducedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedRef.current) setCount(text.length);
  }, [text]);

  useEffect(() => {
    if (controlled || reducedRef.current) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setSelfStart(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setSelfStart(true), io.disconnect())),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [controlled]);

  const started = controlled ? !!start : selfStart;

  // Time-based via rAF so the total duration is fixed even on a heavy page:
  // if repaints are slow the reveal chunks forward rather than stalling.
  useEffect(() => {
    if (reducedRef.current || !started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const shown = Math.min(text.length, Math.floor((now - t0) / speed));
      setCount(shown);
      if (shown < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, text, speed]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={`typeonce ${className}`} aria-label={text}>
      <span className="typeonce-ghost" aria-hidden="true">
        {text}
      </span>
      <span className="typeonce-live" aria-hidden="true">
        {text.slice(0, count)}
        {started && !done && <span className="caret" />}
      </span>
    </span>
  );
}
