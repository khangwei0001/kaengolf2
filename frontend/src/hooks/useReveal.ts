import { useEffect } from 'react';

/**
 * Adds `.is-in` to every `.reveal` element as it scrolls into view.
 * Re-runs when `deps` change so route transitions re-observe new nodes.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-group, .reveal-fade-group'),
    );
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));

    // Safety net: never leave content permanently hidden (e.g. a full-page
    // render that never scrolls, or an observer that misfires).
    const safety = window.setTimeout(() => {
      els.forEach((el) => el.classList.add('is-in'));
    }, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
