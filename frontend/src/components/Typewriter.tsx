import { useEffect, useState } from 'react';

/**
 * Typewriter — types a phrase, holds, deletes, and moves to the next, forever.
 * Keeps hero copy alive after the load animation settles. An ember caret rides
 * along. Under prefers-reduced-motion it renders the first phrase statically.
 */
interface TypewriterProps {
  phrases: string[];
  /** static text shown before the animated part (not typed) */
  prefix?: string;
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdTime?: number;
}

export default function Typewriter({
  phrases,
  prefix = '',
  className = '',
  typeSpeed = 55,
  deleteSpeed = 26,
  holdTime = 1900,
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const current = phrases[index % phrases.length];

    if (!deleting && text === current) {
      const t = window.setTimeout(() => setDeleting(true), holdTime);
      return () => window.clearTimeout(t);
    }
    if (deleting && text === '') {
      const t = window.setTimeout(() => {
        setDeleting(false);
        setIndex((p) => (p + 1) % phrases.length);
      }, 320);
      return () => window.clearTimeout(t);
    }

    const next = deleting
      ? current.slice(0, text.length - 1)
      : current.slice(0, text.length + 1);
    const t = window.setTimeout(() => setText(next), deleting ? deleteSpeed : typeSpeed);
    return () => window.clearTimeout(t);
  }, [text, deleting, index, reduced, phrases, typeSpeed, deleteSpeed, holdTime]);

  return (
    <span className={className} aria-label={`${prefix}${phrases.join('. ')}`}>
      <span aria-hidden="true">
        {prefix}
        {reduced ? phrases[0] : text}
        <span className="caret" />
      </span>
    </span>
  );
}
