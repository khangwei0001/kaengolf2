import { useEffect, useState } from 'react';

/**
 * RotatingWord — swaps through a list of words with a soft fade-and-rise,
 * keeping a headline alive without the restlessness of a full typewriter.
 * Holds the first word statically under prefers-reduced-motion.
 */
interface RotatingWordProps {
  words: string[];
  className?: string;
  /** ms each word stays before swapping */
  interval?: number;
}

export default function RotatingWord({ words, className = '', interval = 2600 }: RotatingWordProps) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setShown(false);
      window.setTimeout(() => {
        setI((p) => (p + 1) % words.length);
        setShown(true);
      }, 380);
    }, interval);
    return () => window.clearInterval(id);
  }, [words, interval]);

  return (
    <span
      className={`word-rotate inline-block ${shown ? 'is-in' : 'is-out'} ${className}`}
      aria-label={words.join(', ')}
    >
      {words[i]}
    </span>
  );
}
